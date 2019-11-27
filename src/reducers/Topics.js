
export const PUSH_TOPICS = "PUSH_TOPICS";
export const CLEAR_TOPICS = "CLEAR_TOPICS";

const TopicsReducer = (state = [], action) => {
  switch(action.type) {
    case PUSH_TOPICS:
      console.log(action.topics);
      return state.concat(action.topics);
    case CLEAR_TOPICS:
      return [];
    default:
      return state;
  }
};

export default TopicsReducer;

