import React from 'react';
import ReactDOM from 'react-dom';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import App from '../../App';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  createUser,
  createTicket,
  createReply
} from 'MockObjects';

// Configure enzyme
configure({ adapter: new Adapter() });

describe('Support page', () => {

  let axiosMock;
  let container;
  let store;

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

  test('/help/support with auth token gets user info on mount', async () => {
    const history = createHistory("/help/support");

    axiosMock.onGet(mockPath("users/me")).reply(200, {
      id: 1,
      name: "Kevin Morris",
      email: "test@example.com"
    });

    axiosMock.onGet(mockPath("tickets")).reply(200, []);

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

    await waitForElement(() => document.querySelector(".logoutButton"));
  });

  test('/help/support/login can login to API', async () => {
    const history = createHistory("/help/support/login");

    axiosMock.onGet(mockPath("users/me")).replyOnce(401);

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

    const email = node.find("#email-input").first();
    const pass = node.find("#password-input").first();

    await act(async () => {
      email.simulate('change', { 
        target: {
          value: "test@example.com"
        }
      });
    });

    await act(async () => {
      pass.simulate('change', {
        target: {
          value: "password"
        }
      });
    });

    // Reset mock adapter
    axiosMock = new MockAdapter(axios);

    // Mock requests
    axiosMock.onPost(mockPath("users/login")).reply(200, {
      token: "abcd"
    });

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets")).reply(200, []);

    const form = node.find(".supportLogin form").first();
    let prevented = false;

    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          prevented = true;
        }
      });
    });
    expect(prevented).toBe(true);

    await waitForElement(() => document.querySelector(".logoutButton"));
    await expect(store.getState().session.isValid).toBe(true);
    node.update();
  });

  test('/help/support with ticket data renders tickets', async () => {
    const history = createHistory("/help/support");

    const tickets = [
      createTicket("Ticket 1", "Ticket body 1", "open", user, []),
      createTicket("Ticket 2", "Ticket body 2", "open", user, [])
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
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    const tbody = node.find("tbody");
    expect(tbody.exists()).toBe(true);

    // Expect two rows.
    const tr = tbody.find("tr");
    expect(tr.length).toBe(2);

    // Expect that the first row matches the first ticket
    const firstRow = tr.at(0);
    expect(firstRow.find("td").at(0).text()).toBe("Ticket 1");

    const secondRow = tr.at(1);
    expect(secondRow.find("td").at(0).text()).toBe("Ticket 2");
  });

  test('invalid session redirects to Login', async () => {
    const history = createHistory("/help/support");

    axiosMock.onGet(mockPath("users/me")).reply(401);

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

    expect(history.location.pathname).toBe("/help/support/login");
  });

  test('valid session redirects from Login', async () => {
    const history = createHistory("/help/support/login");

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

    expect(history.location.pathname).toBe("/help/support");
  });

  test('/help/support/createTicket requires authentication', async () => {
    const history = createHistory("/help/support/createTicket");

    // Reply with bad valid user response, unauthorized.
    axiosMock.onGet(mockPath("users/me")).reply(401);
    axiosMock.onGet(mockPath("tickets")).reply(401);

    // App.Authenticated deals with routing to createTicket
    // when the user is authenticated properly.
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

    // Expect to be redirected to the Login page.
    expect(history.location.pathname).toBe("/help/support/login");
  });

  test('/help/support/createTicket renders when authenticated', async () => {
    const history = createHistory("/help/support/createTicket");

    axiosMock.onGet(mockPath("users/me")).reply(200, user);
    axiosMock.onGet(mockPath("tickets")).reply(200, []);

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

    expect(node.find("form").exists()).toBe(true);
  });

  test('deal with tickets 404', async () => {
    const history = createHistory("/help/support/createTicket");

    axiosMock.onGet(mockPath("users/me")).reply(200, user);

    // Reply with an error to trigger code paths
    axiosMock.onGet(mockPath("tickets")).reply(404);

    const node = mount((
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    ), {
      attachTo: document.getElementById("root")
    });
    node.update();

    expect(store.getState().tickets.data.length).toBe(0);
  });

  test('Ticket page renders', async () => {
    const ticket = createTicket("Ticket 1", "Ticket body 1", "open", user, []);
    const tickets = [ticket];

    const history = createHistory(`/help/support/ticket/${ticket.id}`);

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

    await waitForElement(() => document.querySelector(".ticket"));
    expect(node.find(".ticket").exists()).toBe(true);
  });

  test('not found matches urls past /help/support (review)', async () => {
    const history = createHistory("/help/support/blah");

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
  });

});
