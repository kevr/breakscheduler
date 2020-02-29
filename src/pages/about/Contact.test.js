import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../../App';
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

describe('Contact page', () => {

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

  test('renders and can be submitted', async () => {
    const history = createHistory("/about/contact");

    // Mock up an error response from the server. This should cause an error
    // message at the bottom of the contact form.
    axiosMock.onPost(mockPath("contact")).reply(500);

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

    // With everything blank, the Send button should be disabled
    expect(node.find("button#send-button").hasClass("disabled")).toBe(true);

    let email = node.find("input#email-input");
    let subject = node.find("input#subject-input");
    let body = node.find("textarea#body-input");

    await act(async () => {
      email.simulate('change', {
        target: {
          value: "blah@email.com"
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(true);

    await act(async () => {
      subject.simulate('change', {
        target: {
          value: "Test subject"
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(true);

    await act(async () => {
      body.simulate('change', {
        target: {
          value: "Test body"
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(false);

    // Toggle subject content
    await act(async () => {
      subject.simulate('change', {
        target: {
          value: ''
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(true);

    await act(async () => {
      subject.simulate('change', {
        target: {
          value: 'Some test subject'
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(false);

    // Toggle email
    await act(async () => {
      email.simulate('change', {
        target: {
          value: ''
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(true);

    // Try an invalid email
    await act(async () => {
      email.simulate('change', {
        target: {
          value: "blah blah"
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(true);

    // Restore email, send should not be disabled after this
    await act(async () => {
      email.simulate('change', {
        target: {
          value: "email@example.org"
        }
      });
    });
    node.update();

    expect(node.find("button#send-button").hasClass("disabled")).toBe(false);
    let form = node.find("form#contact-form");
    
    await act(async () => {
      form.simulate('submit');;
    });
    node.update();

    expect(node.find(".error").length).toBe(1);

    axiosMock.onPost(mockPath("contact")).reply(200);
    await act(async () => {
      form.simulate('submit');;
    });
    node.update();

    expect(node.find(".success").length).toBe(1);
  });

});
