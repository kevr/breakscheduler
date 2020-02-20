import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { createStore } from 'redux';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Reducers from '../reducers';
import ReplyForm from './ReplyForm';
import {
  TestRouter,
  createHistory,
  mockPath
} from 'TestUtil';
import {
  createUser,
  createTicket,
  createReply
} from 'MockObjects';

// Setup enzyme
configure({ adapter: new Adapter() });

describe('ReplyForm component', () => {
  
  let axiosMock;
  let store;
  let container;

  // A reusable user object.
  const user = createUser("Test User", "test@example.com");
  const ticket = createTicket("Test ticket", "Test body", "open", user, []);

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    localStorage.setItem("@authToken", "stubToken");
    store = createStore(Reducers);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    localStorage.clear();
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
  });

  test('submits a reply to a Ticket', async () => {
    const history = createHistory(`/help/support/ticket/${ticket.id}`);
    const tickets = [ticket];

    store.dispatch({ type: "SET_SESSION", session: user });
    store.dispatch({ type: "SET_TICKETS", tickets: tickets });

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <ReplyForm
            ticket={ticket}
            collapse={() => {}}
          />
        </TestRouter>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    const reply = createReply(1, ticket.id, "Reply body", user);
    axiosMock.onPost(mockPath("tickets/1/replies")).reply(200, reply);

    const replyBodyInput = node.find("#reply-body-input");
    const replyForm = node.find("#reply-form");
    await act(async () => {
      replyBodyInput.simulate('change', {
        target: {
          value: reply.body
        }
      });
    });

    await act(async () => {
      replyForm.simulate('submit', {
        preventDefault: () => {
          console.log("preventDefault called");
        }
      });
    });
    node.update();

    expect(store.getState().tickets.data[0].replies.length)
      .toBe(1);
  });

  test('submits a Reply and closes a Ticket', async () => {
    const history = createHistory(`/help/support/ticket/${ticket.id}`);
    const tickets = [ticket];

    store.dispatch({ type: "SET_SESSION", session: user });
    store.dispatch({ type: "SET_TICKETS", tickets: tickets });

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <ReplyForm
            ticket={ticket}
            collapse={() => {}}
          />
        </TestRouter>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    const reply = createReply(1, ticket.id, "Reply body", user);
    const updatedTicket = Object.assign({}, ticket, {
      status: "closed",
      replies: [reply]
    });
    axiosMock.onPost(mockPath("tickets/1/replies")).reply(200, reply);
    axiosMock.onPatch(mockPath("tickets/1")).reply(200, updatedTicket);

    const replyBodyInput = node.find("#reply-body-input");
    const dropdownTrigger = node.find(".dropdown-trigger");

    await act(async () => {
      replyBodyInput.simulate('change', {
        target: {
          value: reply.body
        }
      });
    });
    node.update();

    await act(async () => {
      dropdownTrigger.simulate('click');
    });
    node.update();

    const dropdown = node.find(".dropdown-content");

    // Send Reply and Close button in the dropdown.
    const listItem = dropdown.find("li").at(1);
    const dropdownButton = listItem;
    const sendReplyAndCloseButton = listItem.find("a");

    await act(async () => {
      sendReplyAndCloseButton.simulate('click');
    });
    node.update();

    expect(store.getState().tickets.data[0].replies.length)
      .toBe(1);
    expect(store.getState().tickets.data[0].status).toBe("closed");
  });

  test('http error while submitting Reply and closing a Ticket', async () => {
    const history = createHistory(`/help/support/ticket/${ticket.id}`);
    const tickets = [ticket];

    store.dispatch({ type: "SET_SESSION", session: user });
    store.dispatch({ type: "SET_TICKETS", tickets: tickets });

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <ReplyForm
            ticket={ticket}
            collapse={() => {}}
          />
        </TestRouter>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    const reply = createReply(1, ticket.id, "Reply body", user);

    const updatedTicket = Object.assign({}, ticket, {
      status: "closed",
      replies: [reply]
    });
    axiosMock.onPost(mockPath("tickets/1/replies")).reply(200, reply);
    axiosMock.onPatch(mockPath("tickets/1")).reply(500);

    const replyBodyInput = node.find("#reply-body-input");
    const dropdownTrigger = node.find(".dropdown-trigger");

    const replyForm = node.find("#reply-form");

    await act(async () => {
      replyBodyInput.simulate('change', {
        target: {
          value: ''
        }
      });
    });
    node.update();

    await act(async () => {
      replyForm.simulate('submit');
    });
    node.update();

    expect(node.find("#reply-form-error").text())
      .toBe("Reply body is required.");

    await act(async () => {
      replyBodyInput.simulate('change', {
        target: {
          value: reply.body
        }
      });
    });
    node.update();

    await act(async () => {
      dropdownTrigger.simulate('click');
    });
    node.update();

    const dropdown = node.find(".dropdown-content");

    // Send Reply and Close button in the dropdown.
    const listItem = dropdown.find("li").at(1);
    const dropdownButton = listItem;
    const sendReplyAndCloseButton = listItem.find("a");

    await act(async () => {
      sendReplyAndCloseButton.simulate('click');
    });
    node.update();

    expect(store.getState().tickets.data[0].replies.length)
      .toBe(1);
    expect(node.find("#reply-form-error").text())
      .toBe("Encountered a server error while updating ticket state.");
  });
});
