import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Reducers from '../reducers';
import Reply from './Reply';
import {
  TestRouter,
  createHistory,
  mockPath
} from 'TestUtil';
import {
  createUser,
  createTicket,
  createReply
} from 'MockObjects';

// Setup enzyme
configure({ adapter: new Adapter() });

describe('ReplyForm component', () => {
  
  let axiosMock;
  let store;
  let container;

  // A reusable user object.
  const user = createUser("Test User", "test@example.com");
  const ticket = createTicket("Test ticket", "Test body", "open", user.email);

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    localStorage.setItem("@authToken", "stubToken");
    store = createStore(Reducers);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    localStorage.clear();
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
  });

  test('submits a reply to a Ticket', async () => {
    const history = createHistory(`/help/support/ticket/${ticket.id}`);

    const reply = createReply(ticket.id, "Reply body", user.email);

    let node;
    await act(async () => {
      node = mount((
        <Provider store={store}>
          <Reply
            reply={reply}
            isOwner={true}
          />
        </Provider>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    /*
    axiosMock.onDelete(mockPath(`tickets/${ticket.id}/replies/${reply.id}`))
      .reply(500);
    window.confirm = jest.fn().mockImplementation((msg) => true);

    let deleteButton = node.find(".ticketReply").find(".deleteButton");
    await act(async () => {
      deleteButton.simulate('click');
    });
    node.update();
    */

    // First, open up a reply body textarea by clicking in the pre element.
    let replyInfo = node.find(".replyInfo").find("pre");
    await act(async () => {
      replyInfo.simulate('click');
    });
    node.update();

    // Blur the editor, causing handleSave to be called where
    // state.body === props.reply.body
    let replyEditor = node.find(".replyEditor").find("textarea");
    await act(async () => {
      replyEditor.simulate('focus');
    });

    await act(async () => {
      replyEditor.simulate('blur');
    });
    node.update();

    replyInfo = node.find(".replyInfo").find("pre");
    // Open up the textarea again
    await act(async () => {
      replyInfo.simulate('click');
    });
    node.update();

    replyEditor = node.find(".replyEditor").find("textarea");
    // Set the body to an empty string, which causes an error.
    await act(async () => {
      replyEditor.simulate('change', {
        target: {
          value: ""
        }
      });
    });
    node.update();

    await act(async () => {
      replyEditor.simulate('blur');
    });
    node.update();

    expect(node.find(".ticketReply").find(".error").text())
      .toBe("Reply body is required.");

    const updatedBody = "Modified body";
    const updatedReply = Object.assign({}, reply, {
      body: updatedBody
    });
    axiosMock.onPatch(mockPath(`tickets/${ticket.id}/replies/${reply.id}`))
      .reply(200, updatedReply);

    replyEditor = node.find(".replyEditor").find("textarea");
    await act(async () => {
      replyEditor.simulate('focus');
    });
    node.update();

    await act(async () => {
      replyEditor.simulate('change', {
        target: {
          value: updatedBody
        }
      });
    });
    node.update();

    await act(async () => {
      replyEditor.simulate('blur');
    });
    node.update();
  });
});
