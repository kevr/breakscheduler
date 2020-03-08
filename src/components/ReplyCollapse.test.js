import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Reducers from '../reducers';
import ReplyCollapse from './ReplyCollapse';
import {
  mockPath
} from 'TestUtil';
import {
  createUser,
  createTicket,
  createReply
} from 'MockObjects';

configure({ adapter: new Adapter() });

describe('ReplyCollapse component', () => {

  let axiosMock;
  let store;
  let container;

  const user = createUser("Test User", "test@example.com");
  const ticket = createTicket("Test ticket", "Test body", "open", user.email);
  const reply = createReply(ticket.id, "Test reply", user);

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

  test('collapses after replying without onReply', async () => {
    store.dispatch({ type: "SET_TICKET", ticket: ticket });

    let gotPost = false;
    axiosMock.onPost(mockPath(`tickets/${ticket.id}/replies`))
      .replyOnce((config) => {
        gotPost = true;
        return [200, reply];
      });

    let node;
    await act(async () => {
      node = mount((
        <Provider store={store}>
          <ReplyCollapse
            ticket={ticket}
          />
        </Provider>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    // Open Reply collapsible
    let addReply = node.find(".addReply");
    const replyHeader = addReply.find(".collapsible-header");
    await act(async () => {
      replyHeader.simulate('click');
    });
    node.update();

    addReply = node.find(".addReply");

    const replyBodyInput = addReply.find("#reply-body-input");
    await act(async () => {
      replyBodyInput.simulate('change', {
        target: {
          value: "Test reply"
        }
      });
    });
    node.update();

    const replyForm = addReply.find("#reply-form");
    await act(async () => {
      replyForm.simulate('submit');
    });
    node.update();

    expect(gotPost).toBe(true);
  });

  test('calls provided onReply after replying', async () => {
    store.dispatch({ type: "SET_TICKET", ticket: ticket });

    let gotPost = false;
    axiosMock.onPost(mockPath(`tickets/${ticket.id}/replies`))
      .replyOnce((config) => {
        gotPost = true;
        return [200, reply];
      });
    
    let gotReply = false;
    const onReply = () => {
      gotReply = true;
    };

    let node;
    await act(async () => {
      node = mount((
        <Provider store={store}>
          <ReplyCollapse
            ticket={ticket}
            onReply={onReply}
          />
        </Provider>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    // Open Reply collapsible
    let addReply = node.find(".addReply");
    const replyHeader = addReply.find(".collapsible-header");
    await act(async () => {
      replyHeader.simulate('click');
    });
    node.update();

    addReply = node.find(".addReply");

    const replyBodyInput = addReply.find("#reply-body-input");
    await act(async () => {
      replyBodyInput.simulate('change', {
        target: {
          value: reply.body
        }
      });
    });
    node.update();

    const replyForm = addReply.find("#reply-form");
    await act(async () => {
      replyForm.simulate('submit');
    });
    node.update();

    expect(gotReply).toBe(true);
  });


});
