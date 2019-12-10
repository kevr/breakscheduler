import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { createStore } from 'redux';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Reducers from '../../../reducers';
import Support from '../Support';
import App from '../../../App';
import {
  TestRouter,
  createHistory,
  mockPath
} from 'TestUtil';
import {
  createTicket
} from 'mockTickets';

configure({ adapter: new Adapter() });

describe('Login page', () => {

  let axiosMock;
  let store;
  let container;

  // User object that we'll use throughout these tests.
  const userObject = (isAdmin) => ({
    id: 1,
    name: "Test User",
    email: "test@example.com",
    type: isAdmin ? "admin" : "user"
  });

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

  test('can login', async () => {
    const history = createHistory("/help/support/login");

    axiosMock.onGet(mockPath("users/me")).replyOnce(401);

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

    const email = node.find("#email-input");
    await act(async () => {
      email.simulate('change', {
        target: {
          value: "test@example.com"
        }
      });
    });

    const password = node.find("#password-input");
    await act(async () => {
      password.simulate('change', {
        target: {
          value: "fakePassword"
        }
      });
    });

    // First, it doesn't work!
    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(401);

    // The Login form within the Login page
    const form = node.find("form");

    // OK, Login
    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
        }
      });
    });
    node.update();
    expect(history.location.pathname).toBe("/help/support/login");

    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(200, {
        token: "stubToken"
      });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, userObject(false));
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(200, []);

    // OK, Login
    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
        }
      });
    });
    node.update();
    expect(history.location.pathname).toBe("/help/support");

    // We expect a single TR, telling us that we have no tickets.
    expect(node.find("tbody tr").length).toBe(1);
    expect(node.find("tbody tr").text())
      .toBe("No tickets to show...");

    const user = userObject(false);
    store.dispatch({
      type: "SET_TICKETS",
      tickets: [
        createTicket(1, "Test Ticket", "Test Body", "open", user, []),
        createTicket(2, "Another ticket", "Another body", "open", user, [])
      ]
    });

    axiosMock.onGet(mockPath("users/me")).reply(401);

    await act(async () => {
      node.unmount();
      node.mount();
    });

    // Expect the two tickets to be rendered.
    expect(node.find("tbody tr").length).toBe(2);
  });

  test('can login as an Administrator', async () => {
    const history = createHistory("/help/support/login");

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
    // NOTE: This is actually very important after
    // await act is run! In case we got any updates
    // via promises during our mount stage, we want
    // to reflect those changes here.
    node.update();

    const email = node.find("#email-input");
    await act(async () => {
      email.simulate('change', {
        target: {
          value: "test@example.com"
        }
      });
    });

    const password = node.find("#password-input");
    await act(async () => {
      password.simulate('change', {
        target: {
          value: "fakePassword"
        }
      });
    });

    const isAdmin = node.find("#is-admin-input");
    await act(async () => {
      isAdmin.simulate('change', {
        target: {
          checked: true
        }
      });
    });

    const rememberMe = node.find("#remember-input");
    await act(async () => {
      rememberMe.simulate('change', {
        target: {
          checked: true
        }
      });
    });

    axiosMock.onPost(mockPath("users/admin/login"))
      .replyOnce(200, {
        token: "stubToken"
      });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, userObject(true));
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(200, []);

    const form = node.find("form");

    // OK, Login
    let submitClicked = false;
    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          submitClicked = true;
        }
      });
    });
    node.update();
    expect(submitClicked).toBe(true);

    expect(history.location.pathname).toBe("/help/support");

    // We expect a single TR, telling us that we have no tickets.
    expect(node.find("tbody tr").length).toBe(1);
    expect(node.find("tbody tr").text())
      .toBe("No tickets to show...");

    store.dispatch({
      type: "SET_TICKETS",
      tickets: [
        createTicket(
          1, "Test Ticket", "Test Body", "open", userObject(true), []
        ),
        createTicket(
          2, "Another ticket", "Another body", "open", userObject(true), []
        )
      ]
    });

    await act(async () => {
      node.unmount();
    });

    axiosMock.reset();

    axiosMock.onPost(mockPath("users/admin/login"))
      .reply(200, {
        token: "stubToken"
      });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(401);
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, userObject(true));

    await act(async () => {
      node.mount();
    });
    node.update();

    // Expect the two tickets to be rendered.
    expect(node.find("tbody tr").length).toBe(2);
  });

  test('remembers a user logging in', async () => {
    const history = createHistory("/help/support/login");
    
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

    const email = node.find("#email-input");
    const password = node.find("#password-input");
    const rememberMe = node.find("#remember-input");

    await act(async () => {
      email.simulate('change', { target: { value: "test@example.com" } });
      password.simulate('change', { target: { value: "password" } });
      rememberMe.simulate('change', { target: { checked: true } });
    });

    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(200, []);

    const form = node.find("form");
    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          // Do nothing.
        }
      });
    });
    node.update();

    // Expect that we got logged in and redirected to Dashboard
    expect(history.location.pathname).toBe("/help/support");

    // Now, unmount the node and mount a new one.
    await act(async () => {
      node.unmount();
    });

    // history.push to Login again.
    history.push("/help/support/login");
    expect(history.location.pathname).toBe("/help/support/login");

    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(200, []);

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

    // Expect that we got logged in again from our remembered details.
    expect(history.location.pathname).toBe("/help/support");

    node.unmount();
    // Do it again, but with a bad login response
    history.push("/help/support/login");

    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(401, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(401, user);
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(401, []);

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

  test('remembers an admin user logging in', async () => {
    const history = createHistory("/help/support/login");
    
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

    const email = node.find("#email-input");
    const password = node.find("#password-input");
    const isAdmin = node.find("#is-admin-input");
    const rememberMe = node.find("#remember-input");

    await act(async () => {
      email.simulate('change', { target: { value: "test@example.com" } });
      password.simulate('change', { target: { value: "password" } });
      isAdmin.simulate('change', { target: { checked: true } });
      rememberMe.simulate('change', { target: { checked: true } });
    });

    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "admin"
    };

    axiosMock.onPost(mockPath("users/admin/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(200, []);

    const form = node.find("form");
    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          // Do nothing.
        }
      });
    });
    node.update();

    // Expect that we got logged in and redirected to Dashboard
    expect(history.location.pathname).toBe("/help/support");

    // Now, unmount the node and mount a new one.
    await act(async () => {
      node.unmount();
    });

    // history.push to Login again.
    history.push("/help/support/login");
    expect(history.location.pathname).toBe("/help/support/login");

    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.onPost(mockPath("users/admin/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(200, []);

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

    // Expect that we got logged in again from our remembered details.
    expect(history.location.pathname).toBe("/help/support");

    node.unmount();
    // Do it again, but with a bad login response
    history.push("/help/support/login");

    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(401, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(401, user);
    axiosMock.onGet(mockPath("tickets"))
      .replyOnce(401, []);

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

  test('login with then get an error from getSession', async () => {
    const history = createHistory("/help/support/login");

    // Just reply to 401 for all getSessions
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

    const email = node.find("#email-input");
    const password = node.find("#password-input");
    const form = node.find("form");

    // Reply with a valid login, then we store the token.
    axiosMock.onPost(mockPath("users/login"))
      .reply(200, {
        token: "stubToken"
      });

    let submitClicked = false;
    await act(async () => {
      email.simulate('change', {
        target: {
          value: "test@example.com"
        }
      });
    });
    node.update();

    await act(async () => {
      password.simulate('change', {
        target: {
          value: "password"
        }
      });
    });
    node.update();

    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          submitClicked = true;
        }
      });
    });
    node.update();

    expect(submitClicked).toBe(true);
    expect(history.location.pathname).toBe("/help/support/login");
  });

  test('logging in with invalid creds shows an error', async () => {
    const history = createHistory("/help/support/login");

    // Just reply to 401 for all getSessions
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

    const email = node.find("#email-input");
    const password = node.find("#password-input");
    const form = node.find("form");

    // Reply with a valid login, then we store the token.
    axiosMock.onPost(mockPath("users/login"))
      .reply(401);

    let submitClicked = false;
    await act(async () => {
      email.simulate('change', {
        target: {
          value: "test@example.com"
        }
      });
    });
    node.update();

    await act(async () => {
      password.simulate('change', {
        target: {
          value: "password"
        }
      });
    });
    node.update();

    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          submitClicked = true;
        }
      });
    });
    node.update();

    expect(submitClicked).toBe(true);
    expect(history.location.pathname).toBe("/help/support/login");

    node.update();
    expect(node.find("#login-form-error").text()).toBe("Unable to login.");

  });

});
