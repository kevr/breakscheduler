
export const SET_TICKETS = "SET_TICKETS";
export const ADD_TICKET = "ADD_TICKET";
export const SET_TICKET = "SET_TICKET";
export const REMOVE_TICKET = "REMOVE_TICKET";
export const CLEAR_TICKETS = "CLEAR_TICKETS";

const Tickets = (state = [], action) => {
  switch(action.type) {
    case SET_TICKETS:
      return action.tickets;
    case SET_TICKET:
      return [].concat(state).map((t) => {
        // Override the ticket we're looking for
        if(t.id == action.id)
          return action.ticket;
        return t;
      });
    case ADD_TICKET:
      return [].concat(state).concat(action.ticket);
    case REMOVE_TICKET:
      return [].concat(state).filter((t) => t.id != action.id);
    case CLEAR_TICKETS:
      return [];
    default:
      return state;
  }
}

export default Tickets;
