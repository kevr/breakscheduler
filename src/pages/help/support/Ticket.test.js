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
import sinon from 'sinon';
import Reducers from '../../../reducers';
import {
  Bootstrap,
  mockPath,
  flushPromises
} from 'TestUtil';
import Support from '../Support';

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

    // Prepare Redux store
    store.dispatch({
      type: "SET_SESSION",
      session: user
    });

  });

  afterEach(() => {
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
  });

  test('Ticket page renders', async () => {
    store.dispatch({
      type: "SET_TICKETS",
      tickets: [
        {
          id: ticketId,
          subject: "Test ticket",
          body: "Ticket body",
          user: user,
          replies: [
            {
              id: 1,
              ticket_id: ticketId,
              body: "Reply one",
              user: user
            },
            {
              id: 2,
              ticket_id: ticketId,
              body: "Reply two",
              user: user
            }
          ]
        }
      ]
    });

    const node = mount((
      <Bootstrap
        store={store}
        route={`/help/support/ticket/${ticketId}`}
      >
        <Support />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();

    const ticket = node.find(".ticket");
    expect(ticket.exists()).toBe(true);

    // Expect that this Ticket page is rendering the ticket
    // in our Redux store.
    expect(ticket.find("h5").text()).toBe("Test ticket");
  });

  test('can be replied to', async () => {
    store.dispatch({
      type: "SET_TICKETS",
      tickets: [
        {
          id: ticketId,
          subject: "Test ticket",
          body: "Ticket body",
          user: user,
          replies: []
        }
      ]
    });

    const node = mount((
      <Bootstrap
        store={store}
        route={`/help/support/ticket/${ticketId}`}
      >
        <Support />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();
    node.update();

    const collapsible = node.find(".collapsible");
    const header = collapsible.find(".collapsible-header");
    expect(header.exists()).toBe(true);

    // Click to open the Reply dialog
    header.simulate('click', {});
    await flushPromises();
    node.update();

    // Reply dialog should be open, change the textarea
    const replyBody = collapsible.find("textarea");
    expect(replyBody.exists()).toBe(true);

    replyBody.simulate('change', {
      target: {
        value: "Test reply"
      }
    });
    await flushPromises();
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

    expect(node.find(".error").text())
      .toBe("There was an error replying to this ticket.");

    // Now, mock a response that was successful
    axiosMock.onPost(mockPath(`tickets/${ticketId}/replies`))
      .replyOnce(200, {
        id: 1,
        ticket_id: ticketId,
        body: "Test reply",
        user: user
      });

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

    let reply = replies.at(0);
    let editButton = reply.find(".editButton");
    expect(editButton.exists()).toBe(true);

    await act(async () => {
      editButton.simulate('click', {});
    });

    const cancelButton = reply.update().find(".cancelButton");
    await act(async () => {
      cancelButton.simulate('click', {});
    });

    editButton = reply.find(".editButton");
    await act(async () => {
      editButton.simulate('click', {});
    });

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
          value: ""
        }
      });
    });

    await act(async () => {
      replySaveButton.simulate('click', {});
    });

    expect(node.update().find(".error").text())
      .toBe("A reply body is required.");

    await act(async() => {
      replyEditText.simulate('change', {
        target: {
          value: "Edited reply"
        }
      });
    });

    axiosMock.onPatch(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(500);

    await act(async () => {
      replySaveButton.simulate('click', {});
    });

    expect(node.update().find(".error").text())
      .toBe("Encountered a server error while saving reply edits.");

    axiosMock.onPatch(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(200, {
        id: 1,
        ticket_id: 1,
        body: "Edited reply",
        user: user,
        replies: []
      });

    await act(async () => {
      replySaveButton.simulate('click', {});
    });

    node.update();
    reply = node.find(".ticketReply").first();

    const deleteButton = await waitForElement(() => {
      return reply.update().find(".deleteButton").first();
    });

    window.confirm = jest.fn().mockImplementation((message) => {
      return false;
    });

    // Do it with confirm = false
    await act(async () => {
      fireEvent.click(deleteButton.getDOMNode());
    });

    // Then actually delete it
    window.confirm = jest.fn().mockImplementation((message) => {
      return true;
    });

    // First mock out an error.
    axiosMock.onDelete(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(500);

    await act(async () => {
      fireEvent.click(deleteButton.getDOMNode());
    });

    expect(node.update().find(".error").text())
      .toBe("Encountered a server error while deleting reply.");

    // Then, a successful deletion
    axiosMock.onDelete(mockPath(`tickets/${ticketId}/replies/1`))
      .replyOnce(200);

    await act(async () => {
      fireEvent.click(deleteButton.getDOMNode());
    });

    expect(node.update().find(".ticketReply").length).toBe(0);
  });

});

