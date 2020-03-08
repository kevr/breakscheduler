import React from 'react';
import Message from './Message';

describe('Message reducer', () => {

  test('default returns defaultState', () => {
    const state = Message(undefined, {});
    expect(state.messageClass).toBe("error");
    expect(state.string).toBeNull();
  });

  test('SET_MESSAGE returns new message state', () => {
    const state = Message(undefined, {
      type: "SET_MESSAGE",
      messageClass: "success",
      string: "Test"
    });
    expect(state.messageClass).toBe("success");
    expect(state.string).toBe("Test");
  });

  test('CLEAR_MESSAGE returns defaultState', () => {
    const state = Message({
      messageClass: "success",
      string: "Test"
    }, {
      type: "CLEAR_MESSAGE"
    });
    expect(state.messageClass).toBe("error");
    expect(state.string).toBeNull();
  });

});
