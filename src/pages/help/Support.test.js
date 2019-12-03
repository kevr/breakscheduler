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
// import mockAxios from 'jest-mock-axios';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import sinon from 'sinon';
import Support from './Support';
import config from '../../config.json';
import Reducers from '../../reducers';
import {
  Bootstrap,
  mockPath,
  flushPromises
} from 'TestUtil';

// Configure enzyme
configure({ adapter: new Adapter() });

describe('Support Page', () => {

  let axiosMock;
  let container;
  let store;

  const { location } = window;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
    delete window.location;
    window.location = {
      assign: jest.fn()
    };
  });

  afterAll(() => {
    window.location = location;
  });

  beforeEach(() => {
    store = createStore(Reducers);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
    jest.clearAllTimers();
  });

  test('/help/support with auth token gets user info on mount', async () => { 
    axiosMock.onGet(mockPath("users/me")).reply(200, {
      id: 1,
      name: "Kevin Morris",
      email: "test@example.com"
    });

    axiosMock.onGet(mockPath("tickets")).reply(200, []);

    const node = mount((
      <Bootstrap store={store} route="/help/support">
        <Support />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();

    await waitForElement(() => document.querySelector(".logoutButton"));
  });

  test('/help/support/login can login to API', async () => {
    axiosMock.onGet(mockPath("users/me")).replyOnce(401);

    const node = mount((
      <Bootstrap store={store} route="/help/support/login">
        <Support />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();

    node.update();

    const email = node.find("#email-input").first();
    const pass = node.find("#password-input").first();

    email.simulate('change', { 
      target: {
        value: "test@example.com"
      }
    });
    pass.simulate('change', {
      target: {
        value: "password"
      }
    });

    // Reset mock adapter
    axiosMock = new MockAdapter(axios);

    // Mock requests
    axiosMock.onPost(mockPath("users/login")).reply(200, {
      token: "abcd"
    });

    axiosMock.onGet(mockPath("users/me")).reply(200, {
      id: 1,
      name: "Kevin Morris",
      email: "test@example.com"
    });

    axiosMock.onGet(mockPath("tickets")).reply(200, []);

    const form = node.find(".supportLogin form").first();
    let prevented = false;
    form.simulate('submit', {
      preventDefault: () => {
        prevented = true;
      }
    });
    expect(prevented).toBe(true);

    await waitForElement(() => document.querySelector(".logoutButton"));
    await expect(store.getState().session.isValid).toBe(true);

    node.unmount();
    node.mount();
  });

  test('/help/support with ticket data renders tickets', async () => {
    localStorage.setItem("@authToken", "stubToken");

    axiosMock.onGet(mockPath("users/me")).reply(200, {
      id: 1,
      name: "Example User",
      email: "test@example.com",
      type: "user"
    });

    axiosMock.onGet(mockPath("tickets")).reply(200, [
      {
        id: 1,
        subject: "Ticket subject 1",
        body: "Ticket body 1",
        updated_at: "stubUpdated"
      },
      {
        id: 2,
        subject: "Ticket subject 2",
        body: "Ticket body 2",
        updated_at: "stubUpdated"
      }
    ]);

    const node = mount((
      <Bootstrap store={store} route="/help/support">
        <Support />
      </Bootstrap>
    ), {
      assignTo: document.getElementById("root")
    });
    await flushPromises();

    node.update();

    const tbody = node.find("tbody");
    expect(tbody.exists()).toBe(true);

    // Expect two rows.
    const tr = tbody.find("tr");
    expect(tr.length).toBe(2);

    // Expect that the first row matches the first ticket
    const firstRow = tr.at(0);
    expect(firstRow.find("td").first().text()).toBe("1");
    expect(firstRow.find("td").at(1).text()).toBe("Ticket subject 1");
    expect(firstRow.find("td").at(2).text()).toBe("stubUpdated");

    const secondRow = tr.at(1);
    expect(secondRow.find("td").first().text()).toBe("2");
    expect(secondRow.find("td").at(1).text()).toBe("Ticket subject 2");
    expect(secondRow.find("td").at(2).text()).toBe("stubUpdated");
  });

  test('invalid session redirects to Login', async () => {
    axiosMock.onGet(mockPath("users/me")).reply(401);

    let redirected;
    const historyMock = {
      push: jest.fn().mockImplementation((url) => {
        redirected = url;
      })
    };

    const node = mount((
      <Bootstrap store={store} route="/help/support">
        <Support history={historyMock} />
      </Bootstrap>
    ), {
      assignTo: document.getElementById("root")
    });
    await flushPromises();

    node.update();

    expect(redirected).toBe("/help/support/login");
  });

  test('/help/support/createTicket requires authentication', async () => {
    // Reply with bad valid user response, unauthorized.
    axiosMock.onGet(mockPath("users/me")).reply(401);

    let redirected;
    const historyMock = {
      push: (url) => {
        redirected = url;
      }
    };

    // Support.Authenticated deals with routing to createTicket
    // when the user is authenticated properly.
    const node = mount((
      <Bootstrap store={store} route="/help/support/createTicket">
        <Support history={historyMock} />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });

    // Await for componentDidMount stuff and related timers.
    await flushPromises();

    // Update node to reflect DOM changes.
    node.update();

    // Expect to be redirected to the Login page.
    expect(redirected).toBe("/help/support/login");
  });

  test('/help/support/createTicket renders when authenticated', async () => {
    // Reply with a valid user.
    axiosMock.onGet(mockPath("users/me")).reply(200, {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    });

    // No tickets yet.
    axiosMock.onGet(mockPath("tickets")).reply(200, []);

    // Support.Authenticated deals with routing to createTicket
    // when the user is authenticated properly.
    const node = mount((
      <Bootstrap store={store} route="/help/support/createTicket">
        <Support />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });

    // Await for componentDidMount stuff and related timers.
    await flushPromises();

    // Update node to reflect DOM changes
    node.update();

    expect(node.find("form").exists()).toBe(true);
  });

  test('deal with tickets 404', async () => {
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

    // Support.Authenticated deals with routing to createTicket
    // when the user is authenticated properly.
    const node = mount((
      <Bootstrap store={store} route="/help/support/createTicket">
        <Support />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });

    // Await for componentDidMount stuff and related timers.
    await flushPromises();

    // Update node to reflect DOM changes
    node.update();
  });

  test('Ticket page renders', async () => {
    localStorage.setItem("@authToken", "stubToken");
    const ticketId = 1;

    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    axiosMock.onGet(mockPath("users/me")).reply(200, user);

    axiosMock.onGet(mockPath("tickets")).reply(200, [
      {
        id: 1,
        subject: "Ticket 1",
        body: "Ticket body 1",
        user: user,
        replies: []
      }
    ]);

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

    await waitForElement(() => document.querySelector(".ticket"));
    expect(node.find(".ticket").exists()).toBe(true);
  });

  test('not found matches unknown urls past /help/support', async () => {
    let redirected;
    const historyMock = {
      push: (url) => {
        redirected = url;
      }
    };

    const node = mount((
      <Bootstrap store={store} route="/help/support/blah">
        <Support history={historyMock} />
      </Bootstrap>
    ), {
      assignTo: document.getElementById("root")
    });
    await flushPromises();
    node.update();
  });

});
