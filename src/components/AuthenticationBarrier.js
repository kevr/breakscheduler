import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
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

    const params = qs.parse(this.props.location.search);
    const key = params.key;

    if(!session.resolved || !session.isValid || session.id === null) {
      // Try a crude authentication that just grabs
      // from @authToken no matter what. We don't
      // have Redux state yet.
      getSession(key).then(user => setSession(user))
        .catch(error => {
          console.error(error);
          clearSession();
        });
    }
  }

  componentDidUpdate() {
    const {
      session,
      setSession,
      clearSession
    } = this.props;

    const params = qs.parse(this.props.location.search);
    const key = params.key;

    // If we're a guest
    if(!session.registered && !key) {
      getSession().then(user => setSession(user))
        .catch(error => {
          console.error(error);
          if(this.props.session.email) {
            clearSession();
          }
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

export default connect(mapState, mapDispatch)(
  withRouter(AuthenticationBarrier)
);
