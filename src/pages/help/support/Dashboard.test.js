import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { createStore } from 'redux';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Reducers from '../../../reducers';
import {
  createTicket
} from 'mockTickets';
import {
  TestRouter,
  createHistory,
  mockPath
} from 'TestUtil';
import App from '../../../App';

// Configure enzyme
configure({ adapter: new Adapter() });

describe('Dashboard page', () => {

  let axiosMock;
  let store;
  let container;

  let user;
  let tickets;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    localStorage.clear();
    store = createStore(Reducers);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    // Create a single ticket.
    tickets = [
      createTicket(1, "Test ticket", "Test body", "open", user, [])
    ];

  });

  afterEach(() => {
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
  });

  test('clicking a Ticket in the table routes to that ticket', async () => {
    const history = createHistory("/help/support");

    // Setup and mock on-mount requests.
    localStorage.setItem("@authToken", "stubToken");
    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets")).reply(200, tickets);

    // Without Dashboard's parent components, data will never
    // be fetched via axios. So prepare Dashboard's expectation
    // of Redux state before mounting.
    store.dispatch({
      type: "SET_SESSION",
      session: user
    });

    store.dispatch({
      type: "SET_TICKETS",
      tickets: tickets
    });

    // We mount Dashboard via <App /> and routing to /help/support
    // This allows Dashboard to properly access history when redirecting.
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

    // Expect that clicking the first ticket row redirects us
    // to the ticket clicked.
    const ticketRow = node.find(".tickets tbody tr").first();
    await act(async () => {
      ticketRow.simulate('click');
    });
    node.update();

    const ticket = tickets[0];
    expect(history.location.pathname)
      .toBe(`/help/support/ticket/${ticket.id}`);
  });

});
