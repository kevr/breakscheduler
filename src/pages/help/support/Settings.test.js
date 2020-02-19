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

  test('renders', async () => {
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

    const nameInput = node.find("#name-input").at(1);
    await act(async () => {
      nameInput.simulate('change', {
        target: {
          value: "New Name"
        }
      });
    });
    node.update();

    const emailInput = node.find("#email-input").at(1);
    await act(async () => {
      emailInput.simulate('change', {
        target: {
          value: "changed@example.com"
        }
      });
    });
    node.update();

    const passwordInput = node.find("#password-input").at(1);
    await act(async () => {
      passwordInput.simulate('change', {
        target: {
          value: "haha1234"
        }
      });
    });
    node.update();
    
    console.log(node.find("#confirm-input"));
    const confirmInput = node.find("#confirm-input").at(1);
    await act(async () => {
      confirmInput.simulate('change', {
        target: {
          value: "haha1234"
        }
      });
    });
    node.update();

    const updatedUser = Object.assign({}, user, {
      name: "New Name",
      email: "changed@example.com"
    });
    axiosMock.onPatch(mockPath("users/me"))
      .reply(200, updatedUser);
    axiosMock.onGet(mockPath("users/me"))
      .replyOnce(200, updatedUser);
    const submitButton = node.find(".saveTrigger");
    await act(async () => {
      submitButton.simulate('click');
    });
    node.update();

    expect(store.getState().session.name).toBe("New Name");
    expect(store.getState().session.email).toBe("changed@example.com");
  });

});
