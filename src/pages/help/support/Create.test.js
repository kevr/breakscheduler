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

describe('Create ticket page', () => {

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
    const history = createHistory("/help/support/createTicket");
    const user = createUser("Test User", "test@example.com");

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

    // Change subject
    const subject = node.find("#subject-input");
    await act(async () => {
      subject.simulate('change', {
        target: {
          value: "Test subject"
        }
      });
    });

    const body = node.find("#body-input");
    await act(async () => {
      body.simulate('change', {
        target: {
          value: "Test body"
        }
      });
    });

    // First, reply with an error.
    axiosMock.onPost(mockPath("tickets")).replyOnce(500);

    const form = node.find(".ticketCreate").find("form");
    let submitClicked = false;
    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          submitClicked = true;
        }
      });
    });
    expect(submitClicked).toBe(true);
    node.update();

    // Check .error's text
    expect(node.find("#create-ticket-form-error").text())
      .toBe("An error occurred while creating this ticket.");

    const createdTicket =
      createTicket("Test subject", "Test body", "open", user, []);
    axiosMock.onPost(mockPath("tickets")).replyOnce(200, createdTicket);

    await act(async () => {
      form.simulate('submit');
    });
    node.update();

    expect(history.location.pathname)
      .toBe(`/help/support/ticket/${createdTicket.id}`);
  });

});
