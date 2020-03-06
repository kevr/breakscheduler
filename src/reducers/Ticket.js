
export const SET_TICKET = "SET_TICKET";
export const CLEAR_TICKET = "CLEAR_TICKET";
export const RESET_TICKET = "RESET_TICKET";

export const ADD_REPLY = "ADD_REPLY";
export const SET_REPLY = "SET_REPLY";
export const REMOVE_REPLY = "REMOVE_REPLY";

const DEFAULT_STATE = {
  resolved: false,
  exists: false,
  data: null
};

export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case SET_TICKET:
      return Object.assign({}, DEFAULT_STATE, {
        resolved: true,
        exists: true,
        data: action.ticket
      });
    case CLEAR_TICKET:
      return Object.assign({}, DEFAULT_STATE, {
        resolved: true,
        exists: false
      });

      // Requires action.reply, an object containing:
      //
      // id Numeric ID of the new reply
      // ticket_id Numeric ID of the ticket this reply belongs to
    case ADD_REPLY:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          replies: state.data.replies.concat(action.reply)
        })
      });

      // Requires action.reply, an object containing:
      // 
      // id Numeric ID of the reply being updated
      // ticket_id Numeric ID of the ticket being updated
    case SET_REPLY:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          replies: state.data.replies.map((reply) => {
            return reply.id === action.reply.id ? action.reply : reply;
          })
        })
      });

      // Requires action.reply, an object containing:
      //
      // id Numeric ID of the action being removed
      // ticket_id Numeric ID of the ticket being altered
    case REMOVE_REPLY:
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          replies: state.data.replies.filter((reply) => {
            return reply.id !== action.reply.id;
          })
        })
      });

    default:
      return state;
  }
}
