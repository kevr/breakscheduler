import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
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
import config from '../../config.json';
import Reducers from '../../reducers';
import {
  TestRouter,
  createHistory,
  mockPath
} from 'TestUtil';
import {
  createTicket,
  createReply
} from 'mockTickets';

// Configure enzyme
configure({ adapter: new Adapter() });

describe('Support page', () => {

  let axiosMock;
  let container;
  let store;

  const { location } = window;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    localStorage.clear();
    store = createStore(Reducers);
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

    const user = {
      id: 1,
      name: "Kevin Morris",
      email: "test@example.com"
    };

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

    localStorage.setItem("@authToken", "stubToken");

    const user = {
      id: 1,
      name: "Kevin Morris",
      email: "test@example.com"
    };
    axiosMock.onGet(mockPath("users/me")).reply(200, user);

    axiosMock.onGet(mockPath("tickets")).reply(200, [
      createTicket(1, "Ticket subject 1", "Ticket body 1", "open", user, []),
      createTicket(2, "Ticket subject 2", "Ticket body 2", "open", user, [])
    ]);

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
    expect(firstRow.find("td").at(0).text()).toBe("Ticket subject 1");

    const secondRow = tr.at(1);
    expect(secondRow.find("td").at(0).text()).toBe("Ticket subject 2");
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

    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    localStorage.setItem("@authToken", "stubToken");
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

    // Reply with a valid user.
    axiosMock.onGet(mockPath("users/me")).reply(200, {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    });

    // No tickets yet.
    axiosMock.onGet(mockPath("tickets")).reply(200, []);

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

    expect(node.find("form").exists()).toBe(true);
  });

  test('deal with tickets 404', async () => {
    const history = createHistory("/help/support/createTicket");
    // Reply with a valid user.
    axiosMock.onGet(mockPath("users/me")).reply(200, {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    });

    // No tickets yet. We don't actually return any expected
    // 404's from the API server, but we want to handle that
    // case in the UI.
    axiosMock.onGet(mockPath("tickets")).reply(404);

    // App.Authenticated deals with routing to createTicket
    // when the user is authenticated properly.
    const node = mount((
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    ), {
      attachTo: document.getElementById("root")
    });

    // Update node to reflect DOM changes
    node.update();
  });

  test('Ticket page renders', async () => {
    const ticketId = 1;
    const history = createHistory(`/help/support/ticket/${ticketId}`);

    localStorage.setItem("@authToken", "stubToken");

    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    axiosMock.onGet(mockPath("users/me")).reply(200, user);

    axiosMock.onGet(mockPath("tickets")).reply(200, [
      createTicket(1, "Ticket 1", "Ticket body 1", "open", user, [])
    ]);

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

  test('not found matches unknown urls past /help/support', async () => {
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
