import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Support from '../Support';
import App from '../../../App';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  createUser,
  createAdmin,
  createTicket
} from 'MockObjects';

configure({ adapter: new Adapter() });

describe('Login page', () => {

  let axiosMock;
  let store;
  let container;

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

  test('can login', async () => {
    const history = createHistory("/help/support/login");
    const user = createUser("Test User", "test@example.com");

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

    // Login and receive a 401 from the server.
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
    axiosMock.onGet(mockPath("users/me")).replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets")).replyOnce(200, []);

    // OK, Login and receive a 200.
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
  });

  test('can login as an Administrator', async () => {
    const history = createHistory("/help/support/login");
    const admin = createAdmin("Admin User", "admin@example.com");

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
    node.update();

    const password = node.find("#password-input");
    await act(async () => {
      password.simulate('change', {
        target: {
          value: "fakePassword"
        }
      });
    });
    node.update();

    const isAdmin = node.find("#is-admin-input");
    await act(async () => {
      isAdmin.simulate('change', {
        target: {
          checked: true
        }
      });
    });
    node.update();

    const rememberMe = node.find("#remember-input");
    await act(async () => {
      rememberMe.simulate('change', {
        target: {
          checked: true
        }
      });
    });
    node.update();

    axiosMock.onPost(mockPath("users/admin/login"))
      .replyOnce(200, {
        token: "stubToken"
      });
    axiosMock.onGet(mockPath("users/me")).replyOnce(200, admin);
    axiosMock.onGet(mockPath("tickets")).replyOnce(200, []);

    const form = node.find("form");

    // OK, Login
    await act(async () => {
      form.simulate('submit');
    });
    node.update();

    expect(history.location.pathname).toBe("/help/support");

    // We expect a single TR, telling us that we have no tickets.
    expect(node.find("tbody tr").length).toBe(1);
    expect(node.find("tbody tr").text())
      .toBe("No tickets to show...");

    // Update tickets in Redux with some admin tickets.
    // A bit of a simulation of how our app flow works.
    const tickets = [
      createTicket("Test Ticket", "Test Body", "open", admin, []),
      createTicket("Another ticket", "Another body", "open", admin, [])
    ];

    store.dispatch({ type: "SET_TICKETS", tickets: tickets });

    // Now, remount our node, and mock some axios replies
    // to trigger an error-walking code path.
    await act(async () => {
      node.unmount();
    });

    axiosMock.reset();

    const stubToken = { token: "stubToken" };
    axiosMock.onPost(mockPath("users/admin/login"))
      .reply(200, stubToken);
    axiosMock.onGet(mockPath("users/me")).replyOnce(401);
    axiosMock.onGet(mockPath("users/me")).replyOnce(200, admin);

    await act(async () => {
      node.mount();
    });
    node.update();

    // Expect the two tickets to be rendered.
    expect(node.find("tbody tr").length).toBe(2);
  });

  test('remembers a user logging in', async () => {
    const history = createHistory("/help/support/login");
    const user = createUser("Test User", "test@example.com");

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
      email.simulate('change', { target: { value: "test@example.com" } });
    });
    node.update();

    const password = node.find("#password-input");
    await act(async () => {
      password.simulate('change', { target: { value: "password" } });
    });
    node.update();

    const rememberMe = node.find("#remember-input");
    await act(async () => {
      rememberMe.simulate('change', { target: { checked: true } });
    });
    node.update();

    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me")).replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets")).replyOnce(200, []);

    const form = node.find("form");
    await act(async () => {
      form.simulate('submit');
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

    // Teardown DOM and rebuild a fresh one to mount onto.
    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.onPost(mockPath("users/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me")).replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets")).replyOnce(200, []);

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

    // Do it again, but with a bad login response
    node.unmount();
    history.push("/help/support/login");

    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.onPost(mockPath("users/login")).replyOnce(401);
    axiosMock.onGet(mockPath("users/me")).replyOnce(401);
    axiosMock.onGet(mockPath("tickets")).replyOnce(401);

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
    let history = createHistory("/help/support/login");
    const admin = createAdmin("Test User", "test@example.com");

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

    axiosMock.onPost(mockPath("users/admin/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me")).replyOnce(200, admin);
    axiosMock.onGet(mockPath("tickets")).replyOnce(200, []);

    const form = node.find("form");
    await act(async () => {
      form.simulate('submit');
    });
    node.update();

    // Expect that we got logged in and redirected to Dashboard
    expect(history.location.pathname).toBe("/help/support");

    // Now, unmount the node and mount a new one.
    await act(async () => {
      node.unmount();
    });

    history.push("/help/support/login");
    expect(history.location.pathname).toBe("/help/support/login");

    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.onPost(mockPath("users/admin/login"))
      .replyOnce(200, { token: "stubToken" });
    axiosMock.onGet(mockPath("users/me")).replyOnce(200, admin);
    axiosMock.onGet(mockPath("tickets")).replyOnce(200, []);

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

    // Do it again, but with a bad login response
    node.unmount();

    // Reinitialize our references
    // NOTE: We should try to actually simulate a complete
    // rememberedLogin flow. Even though we have full coverage,
    // we aren't exactly testing the case where rememberedLogin
    // is null or valid.
    history = createHistory("/help/support/login");
    store = mockStore();

    document.body.removeChild(container);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);

    axiosMock.reset();
    axiosMock.onPost(mockPath("users/login")).replyOnce(401);
    axiosMock.onGet(mockPath("users/me")).replyOnce(401);
    axiosMock.onGet(mockPath("tickets")).replyOnce(401);

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

    // Reply with a valid login, then we store the token.
    axiosMock.onPost(mockPath("users/login"))
      .reply(200, { token: "stubToken" });

    await act(async () => {
      email.simulate('change', {
        target: {
          value: "test@example.com"
        }
      });
    });
    node.update();

    const password = node.find("#password-input");
    await act(async () => {
      password.simulate('change', {
        target: {
          value: "password"
        }
      });
    });
    node.update();

    const form = node.find("form");
    await act(async () => {
      form.simulate('submit');
    });
    node.update();

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

    // Reply with a valid login, then we store the token.
    axiosMock.onPost(mockPath("users/login")).reply(401);

    await act(async () => {
      email.simulate('change', {
        target: {
          value: "test@example.com"
        }
      });
    });
    node.update();

    const password = node.find("#password-input");
    await act(async () => {
      password.simulate('change', {
        target: {
          value: "password"
        }
      });
    });
    node.update();

    const form = node.find("form");
    await act(async () => {
      form.simulate('submit');
    });
    node.update();

    expect(history.location.pathname).toBe("/help/support/login");

    node.update();
    expect(node.find("#login-form-error").text()).toBe("Unable to login.");

  });

});
