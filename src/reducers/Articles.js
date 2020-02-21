
export const CLEAR_ARTICLES = "CLEAR_ARTICLES";
export const SET_ARTICLES = "SET_ARTICLES";

const DEFAULT_STATE = {
  resolved: false,
  data: []
};

// Our Articles reducer will stay unresolved (resolved: false)
// until we set or clear articles via `action.type`.
//
// This will allow us to decide where we should resolve data
// by checking `state.resolved`.
//
export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case SET_ARTICLES:
      return Object.assign({}, DEFAULT_STATE, {
        resolved: true,
        data: state.data.concat(action.articles)
      });
    case CLEAR_ARTICLES:
      return Object.assign({}, DEFAULT_STATE, {
        resolved: true
      });
    default:
      return state;
  }
}

