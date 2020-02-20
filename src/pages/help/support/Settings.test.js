import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
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

configure({ adapter: new Adapter() });

describe('Settings page', () => {

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

  test('renders and can be used', async () => {
    const history = createHistory("/help/support/settings");
    const user = createUser("Test User", "test@example.com");

    axiosMock.onGet(mockPath("users/me")).replyOnce(200, user);
    axiosMock.onGet(mockPath("tickets")).replyOnce(200, []);

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

    const nameInput = node.update().find("input#name-input");
    await act(async () => {
      nameInput.simulate('change', {
        target: {
          value: "New Name"
        }
      });
      node.update();
    });

    // Let's update the name for now. This will allow us to check validation
    // functions.
    let updatedUser = Object.assign({}, user, {
      name: "New Name",
      email: "changed@example.org"
    });

    axiosMock.onPatch(mockPath("users/me")).reply(200, updatedUser);
    axiosMock.onGet(mockPath("users/me")).reply(200, updatedUser);

    const emailInput = node.find("input#email-input");
    await act(async () => {
      emailInput.simulate('change', {
        target: {
          value: "changed@example.com"
        }
      });
    });
    node.update();

    let submitButton = node.find(".saveTrigger");
    await act(async () => {
      submitButton.simulate('click');
    });
    node.update();

    const passwordInput = node.find("input#password-input");
    let confirmInput = node.find("input#confirm-input");

    // Simulate changing the password to something < 6 characters.
    await act(async () => {
      passwordInput.simulate('change', {
        target: {
          value: "haha"
        }
      });
      node.update();
    });

    await act(async () => {
      confirmInput.simulate('change', {
        target: {
          value: "haha"
        }
      });
      node.update();
    });

    submitButton = node.find(".saveTrigger");
    // This submit button should fail to submitting anything due to
    // the password being < 6 characters. It will also set an error
    // message.
    await act(async () => {
      submitButton.simulate('click');
      node.update();
    });

    // Alright, let's change it to a validly accepted password.
    await act(async () => {
      passwordInput.simulate('change', {
        target: {
          value: "haha1234"
        }
      });
      node.update();
    });

    confirmInput = node.find("input#confirm-input");
    await act(async () => {
      confirmInput.simulate('change', {
        target: {
          value: "haha123"
        }
      });
      node.update();
    });
    // Password mismatches confirmation

    confirmInput = node.find("input#confirm-input");
    expect(confirmInput.hasClass("invalid")).toBe(true);

    submitButton = node.find(".saveTrigger");
    // Try to submit now, but we can't.
    await act(async () => {
      submitButton.simulate('click');
      node.update();
    });

    await act(async () => {
      confirmInput.simulate('change', {
        target: {
          value: "haha1234"
        }
      });
      node.update();
    });
    // Password now matches confirmation

    confirmInput = node.find("input#confirm-input");

    // Failing. Why?
    expect(confirmInput.update().hasClass("invalid")).toBe(false);

    // Mock a bad response from the API server.
    axiosMock.onPatch(mockPath("users/me")).reply(500);
    await act(async () => {
      submitButton.simulate('click');
      node.update();
    });
    // Expect that the HTTP error was displayed

    updatedUser = Object.assign({}, updatedUser, {
      email: "changed@example.com"
    });
    axiosMock.onPatch(mockPath("users/me"))
      .reply(200, updatedUser);
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, updatedUser);
    await act(async () => {
      submitButton.simulate('click');
      node.update();
    });

    expect(store.getState().session.name).toBe("New Name");
    expect(store.getState().session.email).toBe("changed@example.com");
  });

  test('password mismatches confirmation', async () => {
  });

});
