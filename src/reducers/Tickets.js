
export const SET_TICKETS = "SET_TICKETS";
export const ADD_TICKET = "ADD_TICKET";
export const SET_TICKET = "SET_TICKET";
export const REMOVE_TICKET = "REMOVE_TICKET";
export const CLEAR_TICKETS = "CLEAR_TICKETS";

export const ADD_REPLY = "ADD_REPLY";
export const REMOVE_REPLY = "REMOVE_REPLY";
export const SET_REPLY = "SET_REPLY";

const defaultState = {
  resolved: false,
  data: []
};

const Tickets = (state = defaultState, action) => {
  switch(action.type) {
      // Set all tickets.
    case SET_TICKETS:
      return Object.assign({}, state, {
        resolved: true,
        data: action.tickets
      });
    case ADD_TICKET:
      return Object.assign({}, state, {
        data: state.data.concat(action.ticket)
      });

      // Update a ticket, in-place
    case SET_TICKET:
      return Object.assign({}, state, {
        data: state.data.map((t) => {
          if(t.id == action.ticket.id)
            return action.ticket;
          return t;
        })
      });

      // Remove a single ticket
    case REMOVE_TICKET:
      return Object.assign({}, state, {
        data: state.data.filter(t => t.id !== action.id)
      });

      // Remove all tickets: reset them back to []
    case CLEAR_TICKETS:
      return Object.assign({}, defaultState, {
        resolved: true
      });

      // Requires action.reply, an object containing:
      //
      // id Numeric ID of the new reply
      // ticket_id Numeric ID of the ticket this reply belongs to
    case ADD_REPLY:
      return Object.assign({}, state, {
        data: state.data.map((t) => {
          if(t.id === action.reply.ticket_id) {
            // Concat action.reply to ticket replies
            return Object.assign({}, t, {
              replies: t.replies.concat(action.reply)
            });
          }
          return t;
        })
      });

      // Requires action.reply, an object containing:
      // 
      // id Numeric ID of the reply being updated
      // ticket_id Numeric ID of the ticket being updated
    case SET_REPLY:
      return Object.assign({}, state, {
        data: state.data.map((t) => {
          if(t.id === action.reply.ticket_id) {
            return Object.assign({}, t, {
              replies: t.replies.map((reply) => {
                // If this reply matches our action.reply, return
                // the new action.reply.
                if(reply.id === action.reply.id)
                  return action.reply;
                return reply;
              })
            });
          }
          return t;
        })
      });

      // Requires action.reply, an object containing:
      //
      // id Numeric ID of the action being removed
      // ticket_id Numeric ID of the ticket being altered
    case REMOVE_REPLY:
      return Object.assign({}, state, {
        data: state.data.map((t) => {
          if(t.id === action.reply.ticket_id) {
            // Filter replies that don't have the same ID
            return Object.assign({}, t, {
              replies: t.replies.filter(reply => reply.id !== action.reply.id)
            });
          }
          return t;
        })
      });

    default:
      return state;
  }
}

export default Tickets;
