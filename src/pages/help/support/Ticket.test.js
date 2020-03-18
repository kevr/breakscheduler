import React from 'react';
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
import {
  TestRouter,
  createHistory,
  mockPath,
  mockStore
} from 'TestUtil';
import {
  createGuest,
  createUser,
  createAdmin,
  createTicket,
  createReply,
  createReplyChild,
  addReply,
  removeReply
} from 'MockObjects';

configure({ adapter: new Adapter() });

describe('Ticket page', () => {

  let axiosMock;
  let store;
  let container;

  const user = createUser("Test User", "test@example.com");

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    store = mockStore();
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
  });

  test('renders correctly after mounting', async () => {
    const replies = [
      createReplyChild("Reply one"),
      createReplyChild("Reply two")
    ];
    const ticket =
      createTicket("Test ticket", "Ticket body", "open", user.email, replies);
    const tickets = [ticket];

    const history = createHistory(`/help/support/tickets/${ticket.id}`);

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath(`tickets/${ticket.id}`)).reply(200, ticket);

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

    const ticketNode = node.find(".ticket");
    expect(ticketNode.exists()).toBe(true);

    // Expect that this Ticket page is rendering the ticket
    // located in our Redux store.
    expect(ticketNode.find(".card-title .col.s10").text()).toBe("Test ticket");
  });

  // A huge test that uses the entire Ticket page to
  // reply to the ticket and perform other various tasks.
  test('can be navigated and edited', async () => {
    const ticket = createTicket("Test ticket", "Ticket body", "open", user.email);
    const tickets = [ticket];

    const history = createHistory(`/help/support/tickets/${ticket.id}`);

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath(`tickets/${ticket.id}`)).reply(200, ticket);

    let scrolled = false;
    window.HTMLElement.prototype.scrollIntoView = 
      jest.fn().mockImplementation((obj = {}) => {
        scrolled = true;
      });

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

    const replyButton = node.find(".actions > span");

    // Click to open the Reply dialog
    await act(async () => {
      replyButton.simulate('click');
    });
    node.update();

    // Reply dialog should be open, change the textarea
    const replyBody = node.find(".addReply").find("textarea");
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
    axiosMock.onPost(mockPath(`tickets/${ticket.id}/replies`))
      .replyOnce(500);

    // Submit the replyForm
    const replyForm = node.find(".addReply").find("form");
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
    
    const reply = createReply(ticket.id, "Test reply", user);
    axiosMock.onPost(mockPath(`tickets/${ticket.id}/replies`))
      .replyOnce(200, reply);

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
    let replyNode = replies.at(0);

    // We can also delete a reply.
    const deleteButton = await waitForElement(() => {
      return replyNode.update().find(".deleteButton").first();
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
    axiosMock.onDelete(mockPath(`tickets/${ticket.id}/replies/${reply.id}`))
      .replyOnce(500);

    await act(async () => {
      deleteButton.simulate('click');
    });
    node.update();

    expect(node.find("#reply-edit-error").text())
      .toBe("Encountered a server error while deleting reply.");

    // Then, delete the reply successfully.
    axiosMock.onDelete(mockPath(`tickets/${ticket.id}/replies/${reply.id}`))
      .replyOnce(204);

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

    expect(history.location.pathname).toBe("/help/support");
  });

  test('control a ticket as Administrator', async () => {
    const admin = createAdmin("Admin User", "admin@example.com");
    const ticket = createTicket("Test ticket", "Test body", "open", admin.email);
    const tickets = [ticket];

    const history = createHistory(`/help/support/tickets/${ticket.id}`);

    axiosMock.onGet(mockPath("users/me")).reply(200, admin);
    axiosMock.onGet(mockPath(`tickets/${ticket.id}`)).reply(200, ticket);

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

    // This is bad!
    expect(node.find("select").instance().value).toBe("open");

    axiosMock.onPatch(mockPath(`tickets/${ticket.id}`)).replyOnce(500);

    let select = node.find(".statusBox").find("select");
    await act(async () => {
      select.simulate('change', {
        target: {
          value: "closed"
        }
      });
    });
    node.update();

    let updatedTicket = Object.assign({}, ticket, {
      status: "closed"
    });

    axiosMock.onPatch(mockPath(`tickets/${ticket.id}`))
      .replyOnce(200, updatedTicket);
    await act(async () => {
      select.simulate('change', {
        target: {
          value: "closed"
        }
      });
    });
    node.update();

    expect(node.find("select").instance().value).toBe("closed");

    updatedTicket = Object.assign({}, ticket, {
      status: "escalated"
    });

    axiosMock.onPatch(mockPath(`tickets/${ticket.id}`))
      .replyOnce(200, updatedTicket);

    await act(async () => {
      select.simulate('change', {
        target: {
          value: "escalated"
        }
      });
    });
    node.update();

    expect(node.find("select").instance().value).toBe("escalated");

    updatedTicket = Object.assign({}, ticket, {
      status: "open"
    });
    axiosMock.onPatch(mockPath(`tickets/${ticket.id}`))
      .replyOnce(200, updatedTicket);

    // Back to open
    await act(async () => {
      select.simulate('change', {
        target: {
          value: "open"
        }
      });
    });
    node.update();
    
    expect(node.find("select").instance().value).toBe("open");
   
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

    // Could use some modernization
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
    axiosMock.onPost(mockPath(`tickets/${ticket.id}/replies`))
      .replyOnce(200, newReply);
    axiosMock.onPatch(mockPath(`tickets/${ticket.id}`))
      .replyOnce(200, newTicket);

    await act(async () => {
      replySendAndClose.simulate('click');
    });
    node.update();

    // We should have changed to closed status.
    expect(node.find("select").instance().value).toBe("closed");

    // Unmount our node.
    await act(async () => {
      node.unmount();
    });
  });

  test('renders not found details for ticket', async () => {
    const history = createHistory("/help/support/tickets/666");

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets/666")).reply(404);

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

  test('navigate a ticket as guest user', async () => {
    const guestUser = createGuest("guest@example.com");
    const ticket = createTicket("Subject", "body", "open", guestUser.email);

    const history = createHistory(
      `/help/support/tickets/${ticket.id}?key=stubKey`);

    axiosMock.onGet(mockPath(`users/me?key=stubKey`))
      .reply(200, guestUser);
    axiosMock.onGet(mockPath(`tickets/${ticket.id}?key=stubKey`))
      .reply(200, ticket);

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

    axiosMock.onGet(mockPath("users/me")).reply(401);
    history.push("/help/support");
    node.update();
  });

});

