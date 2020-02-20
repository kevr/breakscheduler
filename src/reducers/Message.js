
const defaultState = {
  messageClass: "error",
  string: null
};

const SET_MESSAGE = "SET_MESSAGE";
const CLEAR_MESSAGE = "CLEAR_MESSAGE";

const Message = (state = defaultState, action) => {
  switch(action.type) {
    case SET_MESSAGE:
      return Object.assign({}, state, {
        messageClass: action.messageClass,
        string: action.string
      });
    case CLEAR_MESSAGE:
      return defaultState;
    default:
      return state;
  }
}

export default Message;
