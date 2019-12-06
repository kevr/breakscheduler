import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { createStore } from 'redux';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Reducers from '../../../reducers';
import {
  TestRouter,
  createHistory,
  mockPath
} from 'TestUtil';
import Create from './Create';
import App from '../../../App';
import Support from '../Support';
import PropTypes from 'prop-types';

configure({ adapter: new Adapter() });

describe('Create ticket page', () => {

  let axiosMock;
  let store;
  let container;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
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
  });

  test('renders', async () => {
    const history = createHistory("/help/support/createTicket");

    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

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
    expect(node.find(".error").text())
      .toBe("An error occurred while creating this ticket.");

    const ticketCreated = {
      id: 1,
      subject: "Test subject",
      body: "Test body",
      user: user,
      status: "open",
      replies: []
    };

    axiosMock.onPost(mockPath("tickets")).replyOnce(200, ticketCreated);

    submitClicked = false;
    await act(async () => {
      form.simulate('submit', {
        preventDefault: () => {
          submitClicked = true;
        }
      });
    });
    expect(submitClicked).toBe(true);
    node.update();

    expect(history.location.pathname).toBe("/help/support/ticket/1");
  });

});
