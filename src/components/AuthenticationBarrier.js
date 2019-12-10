import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getSession
} from '../actions/API';

class AuthenticationBarrier extends Component {
  componentDidMount() {
    console.log(`AuthenticationBarrier.componentDidMount`);

    const {
      session,
      setSession,
      clearSession
    } = this.props;

    if(!session.resolved || !session.isValid) {
      // Try a crude authentication that just grabs
      // from @authToken no matter what. We don't
      // have Redux state yet.
      getSession().then(user => setSession(user))
        .catch(error => {
          console.error(error);
          clearSession();
        });
    }
  }

  render() {
    console.log(`AuthenticationBarrier.render`);

    const {
      session,
      children
    } = this.props;

    const isAuthenticated = session.resolved && session.isValid;

    return (
      <span className="authBarrier">
        {/* A simple authState marker DOM element. */}
        <span
          className="authState"
          authenticated={isAuthenticated.toString()}
        />
        <span className="authChildren">
          {children}
        </span>
      </span>
    );
  }
}

const mapState = (state, ownProps) => ({
  // Subscribe to token so we receive updates
  session: state.session
});

const mapDispatch = (dispatch, ownProps) => ({
  setSession: (session) => dispatch({
    type: "SET_SESSION",
    session: session
  }),
  clearSession: () => dispatch({
    type: "CLEAR_SESSION"
  })
});

export default connect(mapState, mapDispatch)(AuthenticationBarrier);
