
export const SET_SESSION = "SET_SESSION";
export const CLEAR_SESSION = "CLEAR_SESSION";

const Session = (state = { isValid: false, resolved: false }, action) => {
  switch(action.type) {
    case SET_SESSION:
      return Object.assign({}, state, {
        isValid: true,
        resolved: true
      }, action.session);
    case CLEAR_SESSION:
      return { isValid: false, resolved: true };
    default:
      return state;
  }
}

export default Session;
