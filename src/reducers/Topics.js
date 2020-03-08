
export const SET_TOPICS = "SET_TOPICS";
export const CLEAR_TOPICS = "CLEAR_TOPICS";

const DEFAULT_STATE = {
  resolved: false,
  data: []
};

const TopicsReducer = (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case SET_TOPICS:
      console.log(action.topics);
      return Object.assign({}, DEFAULT_STATE, {
        resolved: true,
        data: action.topics
      });
    case CLEAR_TOPICS:
      return Object.assign({}, DEFAULT_STATE, {
        resolved: true
      });
    default:
      return state;
  }
};

export default TopicsReducer;

