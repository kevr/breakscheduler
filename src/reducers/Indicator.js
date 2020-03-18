
const DEFAULT_STATE = {
  enabled: false, // Is this indicator enabled?
  loaded: false, // Is this indicator done loading?
  success: true // Is this indicator successful?
};

export default (state = DEFAULT_STATE, action) => {
  switch(`${action.id}_${action.type}`) {
    case `${action.id}_SET_ENABLED`:
      return Object.assign({}, state, {
        enabled: true
      });
    case `${action.id}_SET_LOADING`:
      return Object.assign({}, state, {
        loaded: false
      });
    case `${action.id}_SET_SUCCESS`:
      return Object.assign({}, state, {
        success: true,
        loaded: true
      });
    case `${action.id}_SET_FAILURE`:
      return Object.assign({}, state, {
        success: false,
        loaded: true
      });
    default:
      return state;
  }
}
