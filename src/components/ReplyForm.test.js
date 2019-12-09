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
  mockPath,
  flushPromises
} from 'TestUtil';
import {
  createTicket
} from 'mockTickets';

// Setup enzyme
configure({ adapter: new Adapter() });

describe('ReplyForm component', () => {
  
  let axiosMock;
  let store;
  let container;

  const user = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    type: "user"
  };

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
    const history = createHistory("/help/support/ticket/1");

    const tickets = [
      createTicket(1, "Test ticket", "Test body", "open", user, [])
    ];
    const ticket = tickets[0];

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

    const reply = {
      id: 1,
      ticket_id: ticket.id,
      body: "Reply body",
      user: user
    };

    axiosMock.onPost(mockPath("tickets/1/replies")).reply(200, reply);

    const body = node.find("#reply-body-input");
    const replyForm = node.find("#reply-form");
    await act(async () => {
      body.simulate('change', {
        target: {
          value: reply.body
        }
      });
      replyForm.simulate('submit', {
        preventDefault: () => {
          console.log("preventDefault called");
        }
      });
    });
    node.update();

    console.log(store.getState());
    console.log(store.getState().tickets.data[0]);
    expect(store.getState().tickets.data[0].replies.length)
      .toBe(1);
  });

  // We need to analyze this test to see why it's not updating
  // Redux. We should log out from API request/response points
  // to see where our flow starts and ends.
  test('submits a Reply and closes a Ticket', async () => {
    const history = createHistory("/help/support/ticket/1");

    const tickets = [
      createTicket(1, "Test ticket", "Test body", "open", user, [])
    ];
    const ticket = tickets[0];

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

    const reply = {
      id: 1,
      ticket_id: ticket.id,
      body: "Reply body",
      user: user
    };

    const updatedTicket = Object.assign({}, ticket, {
      status: "closed",
      replies: [reply]
    });
    axiosMock.onPost(mockPath("tickets/1/replies")).reply(200, reply);
    axiosMock.onPatch(mockPath("tickets/1")).reply(200, updatedTicket);

    const body = node.find("#reply-body-input");
    const dropdownTrigger = node.find(".dropdown-trigger");

    const replyForm = node.find("#reply-form");
    await act(async () => {
      body.simulate('change', {
        target: {
          value: reply.body
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

    await act(async () => {
      // Same thing as clicking dropdownButton; this <a> is a child.
      anchor.simulate('click', {
        preventDefault: () => {
          console.log("anchor prevented");
        }
      });
    });
    node.update();

    console.log(dropdownButton.html());

    // We expect the form to have submitted and resolved
    // promises at this point.
    console.log(store.getState());
    console.log(store.getState().tickets.data[0]);
    expect(store.getState().tickets.data[0].replies.length)
      .toBe(1);
  });

  test('http error while submitting Reply and closing a Ticket', async () => {
    const history = createHistory("/help/support/ticket/1");

    const tickets = [
      createTicket(1, "Test ticket", "Test body", "open", user, [])
    ];
    const ticket = tickets[0];

    localStorage.setItem("@authToken", "stubToken");
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

    const reply = {
      id: 1,
      ticket_id: ticket.id,
      body: "Reply body",
      user: user
    };

    const updatedTicket = Object.assign({}, ticket, {
      status: "closed",
      replies: [reply]
    });
    axiosMock.onPost(mockPath("tickets/1/replies")).reply(200, reply);
    axiosMock.onPatch(mockPath("tickets/1")).reply(500);

    const body = node.find("#reply-body-input");
    const dropdownTrigger = node.find(".dropdown-trigger");

    const replyForm = node.find("#reply-form");
    await act(async () => {
      body.simulate('change', {
        target: {
          value: reply.body
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

    await act(async () => {
      // Click this for coverage: does nothing.
      anchor.simulate('click', {
        preventDefault: () => {
          console.log("anchor prevented");
        }
      });
    });
    node.update();

    console.log(dropdownButton.html());

    // We expect the form to have submitted and resolved
    // promises at this point.
    console.log(store.getState());
    console.log(store.getState().tickets.data[0]);
    expect(store.getState().tickets.data[0].replies.length)
      .toBe(1);

    expect(node.find(".error").text())
      .toBe("Encountered a server error while updating ticket state.");
  });
});
