
export const SET_TICKETS = "SET_TICKETS";
export const ADD_TICKET = "ADD_TICKET";
export const SET_TICKET = "SET_TICKET";
export const REMOVE_TICKET = "REMOVE_TICKET";
export const CLEAR_TICKETS = "CLEAR_TICKETS";

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
          if(t.id === action.ticket.id)
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

    default:
      return state;
  }
}

export default Tickets;
