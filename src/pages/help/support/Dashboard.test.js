import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import App from '../../../App';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  createUser,
  createTicket
} from 'MockObjects';

// Configure enzyme
configure({ adapter: new Adapter() });

describe('Dashboard page', () => {

  let axiosMock;
  let store;
  let container;

  const user = createUser("Test User", "test@example.com");
  const tickets = [ 
    createTicket("Closed ticket", "Closed body", "closed", user, []),
    createTicket("Open ticket", "Open body", "open", user, []),
    createTicket("Escalated ticket", "Escalated body", "escalated", user, []),
    createTicket("Closed ticket", "Closed body", "closed", user, [])
  ];

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

  test('clicking a Ticket in the table routes to that ticket', async () => {
    const history = createHistory("/help/support");

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

  // To be implemented.
  test('searching Tickets returns the proper results', async () => {
    const history = createHistory("/help/support");

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets")).reply(200, tickets);

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

    const searchInput = node.find("#ticket-search-input").at(1);
    await act(async () => {
      searchInput.simulate('change', {
        target: {
          value: "Open ticket"
        }
      });
    });
    node.update();

    let searchResults = node.find("tbody tr");
    expect(searchResults.length).toBe(1);

    let firstResult = searchResults.find("td").first();
    expect(firstResult.find("a").text()).toBe("Open ticket");

    await act(async () => {
      searchInput.simulate('change', {
        target: {
          value: "Closed ticket"
        }
      });
    });
    node.update();

    // Get all search result rows and expect that they're all
    // tickets with "Closed ticket" in the subject.
    searchResults = node.find("tbody tr");
    searchResults.map((result) => {
      expect(result.find("td").first().text()).toBe("Closed ticket");
    });
  });

});
