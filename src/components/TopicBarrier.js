import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTopics } from '../actions/API';

class TopicBarrier extends Component {
  componentDidMount() {
    console.log("TopicBarrier.componentDidMount");
    const {
      topics,
      setTopics,
      clearTopics
    } = this.props;
    if(!topics.resolved) {
      getTopics().then(topics => setTopics(topics))
        .catch(error => {
          console.error(error);
          clearTopics();
        });
    }
  }

  render() {
    console.log("TopicBarrier.render");
    const {
      children
    } = this.props;

    return (
      <span className="topicsProbe">
        {children}
      </span>
    );
  }
}

const mapState = (state, ownProps) => ({
  topics: state.topics
});

const mapDispatch = (dispatch, ownProps) => ({
  setTopics: (topics) => dispatch({
    type: "SET_TOPICS",
    topics: topics
  }),
  clearTopics: () =>
    dispatch({ type: "CLEAR_TOPICS" }),
});

export default connect(mapState, mapDispatch)(TopicBarrier);
