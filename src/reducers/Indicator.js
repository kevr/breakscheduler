
// Default state for each indicator stored.
const INDICATOR_STATE = {
  enabled: false, // Is this indicator enabled?
  loaded: false, // Is this indicator done loading?
  success: true, // Is this indicator successful?
};

// Default state is an empty object.
const DEFAULT_STATE = {};

export default (state = DEFAULT_STATE, action) => {
  switch(`${action.id}_${action.type}`) {
    case `${action.id}_SET_ENABLED`:
      return Object.assign({}, state, {
        [action.id]: Object.assign({}, INDICATOR_STATE, {
          enabled: true
        })
      });
    case `${action.id}_SET_LOADING`:
      return Object.assign({}, state, {
        [action.id]: Object.assign({}, state[action.id], {
          loaded: false
        })
      });
    case `${action.id}_SET_SUCCESS`:
      return Object.assign({}, state, {
        [action.id]: Object.assign({}, state[action.id], {
          success: true,
          loaded: true
        })
      });
    case `${action.id}_SET_FAILURE`:
      return Object.assign({}, state, {
        [action.id]: Object.assign({}, state[action.id], {
          success: false,
          loaded: true
        })
      });
    default:
      return state;
  }
}
