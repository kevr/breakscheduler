import React from 'react';
import { createStore } from 'redux';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import App from '../../../App';
import Reducers from '../../../reducers';
import {
  TestRouter,
  createHistory,
  mockPath,
  flushPromises
} from 'TestUtil';
import {
  createTicket,
  createReply,
  addReply,
  removeReply
} from 'mockTickets';

configure({ adapter: new Adapter() });

describe('Ticket page', () => {

  let axiosMock;
  let store;
  let container;

  // persistent data to use between tests
  let user;
  let ticketId;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    store = createStore(Reducers);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    // Our mocked up user
    user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };
    
    // Our mocked up ticketId value.
    ticketId = 1;
  });

  afterEach(() => {
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
  });

  test('renders correctly after mounting', async () => {
    const history = createHistory(`/help/support/ticket/${ticketId}`);

    const replies = [
      createReply(1, ticketId, "Reply one", user),
      createReply(2, ticketId, "Reply two", user)
    ];

    const tickets = [
      createTicket(
        ticketId, "Test ticket", "Ticket body", "open", user, replies
      )
    ];

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets")).reply(200, tickets);

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <App />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });
    node.update();

    const ticket = node.find(".ticket");
    expect(ticket.exists()).toBe(true);

    // Expect that this Ticket page is rendering the ticket
    // located in our Redux store.
    expect(ticket.find(".card-title .col.s10").text()).toBe("Test ticket");
  });

  // A huge test that uses the entire Ticket page to
  // reply to the ticket and perform other various tasks.
  test('can be navigated and edited', async () => {
    const history = createHistory(`/help/support/ticket/${ticketId}`);

    // Mock up some tickets.
    const tickets = [
      createTicket(ticketId, "Test ticket", "Ticket body", "open", user, [])
    ];
    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets")).reply(200, tickets);

    // Mount the node at /help/support/ticket/:id
    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <App />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });
    node.update();

    const collapsible = node.find(".addReply");
    const header = collapsible.find(".toggleButton");
    expect(header.exists()).toBe(true);

    // Click to open the Reply dialog
    await act(async () => {
      header.simulate('click');
    });
    node.update();

    // Reply dialog should be open, change the textarea
    const replyBody = collapsible.find("textarea");
    expect(replyBody.exists()).toBe(true);

    await act(async () => {
      replyBody.simulate('change', {
        target: {
          value: "Test reply"
        }
      });
    });
    node.update();

    // First, we'll mock an error to test that code path
    axiosMock.onPost(mockPath(`tickets/${ticketId}/replies`))
      .replyOnce(500);

    // Submit the replyForm
    const replyForm = collapsible.find("form");
    expect(replyForm.exists()).toBe(true);

    await act(async () => {
      replyForm.simulate('submit', {
        preventDefault: () => {
          console.log("preventDefault mock called");
        }
      });
    });
    node.update();

    expect(node.find("#reply-form-error").text())
      .toBe("Unable to add reply. See the browser inspector for details.");

    // Now, mock a response that was successful
    axiosMock.onPost(mockPath(`tickets/${ticketId}/replies`))
      .replyOnce(200, createReply(1, ticketId, "Test reply", user));

    // Submit again, with a proper network mock
    await act(async () => {
      replyForm.simulate('submit', {
        preventDefault: () => {
          console.log("preventDefault mock called");
        }
      });
    });
    node.update();

    // Now, let's edit a reply on the ticket page.
    const replies = node.find(".ticketReply");
    expect(replies.length).toBe(1);

    // Now, begin to edit a reply.
    let reply = replies.at(0);
    let editButton = reply.find(".editButton");
    expect(editButton.exists()).toBe(true);

    await act(async () => {
      editButton.simulate('click');
    });
    node.update();

    // We can cancel an edit.
    const cancelButton = reply.update().find(".cancelButton");
    await act(async () => {
      cancelButton.simulate('click');
    });
    node.update();

    editButton = reply.find(".editButton");
    await act(async () => {
      editButton.simulate('click');
    });

    // Or we can fill out the text area with new content.
    const replyEditor = await waitForElement(() => {
      return node.update().find(".replyEditor").first();
    });
    reply = node.find(".ticketReply").first();

    // const replyEditor = reply.find(".replyEditor");
    expect(replyEditor.exists()).toBe(true);

    const replyEditText = replyEditor.find("textarea");
    expect(replyEditText.exists()).toBe(true);

    // Try to save an edit with no content
    const replySaveButton = replyEditor.find(".saveButton");

    await act(async () => {
      replyEditText.simulate('change', {
        target: {
          value: ''
        }
      });
    });
    node.update();

    // We can try to save edits with a blank body.
    await act(async () => {
      replySaveButton.simulate('click');
    });
    node.update();

    // But a body is required.
    expect(node.find("#reply-edit-error").text())
      .toBe("Reply body is required.");

    await act(async() => {
      replyEditText.simulate('change', {
        target: {
          value: "Edited reply"
        }
      });
    });
    node.update();

    // We can try to edit the reply again, with a 500 API server error.
    axiosMock.onPatch(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(500);

    await act(async () => {
      replySaveButton.simulate('click');
    });
    node.update();

    expect(node.find("#reply-edit-error").text())
      .toBe("Encountered a server error while saving reply edits.");

    // Now we can update our reply successfully.
    axiosMock.onPatch(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(200, createReply(1, ticketId, "Edited reply", user));

    await act(async () => {
      replySaveButton.simulate('click');
    });
    node.update();
    reply = node.find(".ticketReply").first();

    // We can also delete a reply.
    const deleteButton = await waitForElement(() => {
      return reply.update().find(".deleteButton").first();
    });

    window.confirm = jest.fn().mockImplementation((message) => {
      return false;
    });

    // Do it with confirm = false
    await act(async () => {
      deleteButton.simulate('click');
    });
    node.update();

    // Then actually delete it
    window.confirm = jest.fn().mockImplementation((message) => {
      return true;
    });

    // First mock out an error.
    axiosMock.onDelete(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(500);

    await act(async () => {
      deleteButton.simulate('click');
    });
    node.update();

    expect(node.find("#reply-edit-error").text())
      .toBe("Encountered a server error while deleting reply.");

    // Then, delete the reply successfully.
    axiosMock.onDelete(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(200);

    await act(async () => {
      deleteButton.simulate('click');
    });
    node.update();

    // Expect that we deleted the reply and have none left.
    expect(node.find(".ticketReply").length).toBe(0);

    // Now, navigate away from the Ticket page to fire
    // componentWillUnmount
    await act(async () => {
      history.push("/help/support");
    });
  });

  test('control a ticket as Administrator', async () => {
    const history = createHistory("/help/support/ticket/1");
    localStorage.setItem("@authToken", "stubToken");

    const admin = {
      id: 2,
      name: "Admin User",
      email: "admin@example.com",
      type: "admin"
    };

    const ticket =
      createTicket(1, "Test ticket", "Test body", "open", admin, []);

    axiosMock.onGet(mockPath("users/me")).reply(200, admin);
    axiosMock.onGet(mockPath("tickets")).reply(200, [ticket]);

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <App />
        </TestRouter>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find("select").instance().value).toBe("open");
    expect(node.find("#status-badge").at(1).text()).toBe("Open");

    let control = node.find(".ticketControl");
    expect(control.exists()).toBe(true);

    let select = control.find("select");
    await act(async () => {
      select.simulate('change', {
        target: {
          value: "closed"
        }
      });
    });
    node.update();

    // Update our copy of ticketControl
    control = node.find(".ticketControl");

    // Click the Save Button
    let button = control.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Save Changes");

    axiosMock.onPatch(mockPath("tickets/1")).replyOnce(500);

    await act(async () => {
      button.simulate('click');
    });
    node.update();

    expect(node.find("#ticket-control-error").text())
      .toBe("Unable to update ticket through API.");

    let updatedTicket = Object.assign({}, ticket, {
      status: "closed"
    });

    axiosMock.onPatch(mockPath("tickets/1"))
      .replyOnce(200, updatedTicket);

    await act(async () => {
      button.simulate('click');
    });
    node.update();
    control = node.find(".ticketControl");

    expect(node.find("select").instance().value).toBe("closed");
    expect(node.find("#status-badge").at(1).text()).toBe("Closed");

    await act(async () => {
      select.simulate('change', {
        target: {
          value: "escalated"
        }
      });
    });
    node.update();

    // Update our copy of ticketControl
    control = node.find(".ticketControl");

    // Click the Save Button
    button = control.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Save Changes");

    updatedTicket = Object.assign({}, ticket, {
      status: "escalated"
    });

    axiosMock.onPatch(mockPath("tickets/1"))
      .replyOnce(200, updatedTicket);

    await act(async () => {
      button.simulate('click');
    });
    node.update();
    control = node.find(".ticketControl");

    expect(node.find("select").instance().value).toBe("escalated");
    expect(node.find("#status-badge").at(1).text()).toBe("Escalated");

    // Back to open
    await act(async () => {
      select.simulate('change', {
        target: {
          value: "open"
        }
      });
    });
    node.update();

    // Update our copy of ticketControl
    control = node.find(".ticketControl");

    // Click the Save Button
    button = control.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Save Changes");

    updatedTicket = Object.assign({}, ticket, {
      status: "open"
    });

    axiosMock.onPatch(mockPath("tickets/1"))
      .replyOnce(200, updatedTicket);

    await act(async () => {
      button.simulate('click');
    });

    node.update();
    control = node.find(".ticketControl");

    expect(node.find("#status-badge").at(1).text()).toBe("Open");

    // COPIED
    const ticketControl = node.find(".ticketControl");
    
    select = ticketControl.find("#status-select").at(1);
    const expectSelectValue = (value) => {
      select.update();
      expect(select.instance().value).toBe(value);
    };

    expectSelectValue("open");
    
    const replyCollapse = node.find(".addReply");
    await act(async () => {
      replyCollapse.simulate('click');
    });

    const replyForm = replyCollapse.find("#reply-form");
    const replyBody = replyForm.find("#reply-body-input");

    await act(async () => {
      replyBody.simulate('change', {
        target: {
          value: "Blah"
        }
      });
    });
    node.update();
    
    const replyDropdownTrigger = replyForm.find(".dropdown-trigger");
    await act(async () => {
      replyDropdownTrigger.simulate('click');
    });
    node.update();

    const replyDropdown = replyForm.find("#reply-dropdown");
    const replySendAndClose = replyDropdown.find("li").at(1).find("a");

    const newReply = {
      id: 10,
      ticket_id: 1,
      body: "Blah",
      user: user
    };

    const newTicket = Object.assign({}, updatedTicket, {
      status: "closed",
      replies: updatedTicket.replies.concat(newReply)
    });

    // Mock POST to add reply, then PATCH to close the ticket
    axiosMock.onPost(mockPath("tickets/1/replies"))
      .replyOnce(200, newReply);
    axiosMock.onPatch(mockPath("tickets/1"))
      .replyOnce(200, newTicket);

    await act(async () => {
      replySendAndClose.simulate('click');
    });
    node.update();

    await act(async () => {
      replyForm.simulate('submit');
    });
    node.update();

    expectSelectValue("closed");
    /*
    const body = node.find("#reply-body-input");
    const dropdownTrigger = node.find(".addReply .dropdown-trigger");

    const replyForm = node.find("#reply-form");
    await act(async () => {
      body.simulate('change', {
        target: {
          value: "Blah"
        }
      });
      dropdownTrigger.simulate('click');
    });
    node.update();

    const dropdown = node.find(".dropdown-content");

    // Send Reply and Close button in the dropdown.
    const listItem = dropdown.find("li").at(1);
    const dropdownButton = listItem;
    const anchor = listItem.find("a");

    const newReply = {
      id: 10,
      ticket_id: 1,
      body: "Blah",
      user: user
    };

    updatedTicket = Object.assign({}, updatedTicket, {
      status: "closed",
      replies: updatedTicket.replies.concat(newReply)
    });

    axiosMock.onPost("tickets/1/replies")
      .replyOnce(200, {
        id: 10,
        ticket_id: 1,
        body: "Blah",
        user: user
      });
    axiosMock.onPatch("tickets/1")
      .replyOnce(200, updatedTicket);

    await act(async () => {
      // Same thing as clicking dropdownButton; this <a> is a child.
      anchor.simulate('click', {
        preventDefault: () => {
          console.log("anchor prevented");
        }
      });
    });
    node.update();

    expect(node.find("select").instance().value).toBe("closed");
    select.update();
    expect(select.instance().value).toBe("closed");
    */

    // Unmount our node.
    await act(async () => {
      node.unmount();
    });
  });

  test('renders not found details for ticket', async () => {
    const history = createHistory("/help/support/ticket/666");

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets")).reply(200, []);

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <App />
        </TestRouter>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find(".textCenter").text())
      .toBe("The ticket you were looking for " +
            "with id '666' could not be located.");
  });

});

