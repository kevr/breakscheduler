import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, useParams } from 'react-router-dom';
import { getRequest } from '../../actions/API';
import UserWidget from '../../components/UserWidget';
import Layout from '../Layout';
import Subpages from './support';
import { SupportRouter } from './support';
import AuthenticationBarrier from '../../components/AuthenticationBarrier';

class Support extends Component {
  componentDidUpdate(lastProps) {
    if(lastProps.session.resolved &&
      !lastProps.session.isValid &&
      this.props.session.isValid) {
      // If we just logged in, redirect to the Dashboard.
      this.props.history.push("/help/support");
    }
  }

  render() {
    const {
      session
    } = this.props;

    return (
      <div className="container">
        <div className="row">
          <UserWidget userData={session} />
        </div>

        <div className="Content">
          <AuthenticationBarrier>
            <SupportRouter />
          </AuthenticationBarrier>
        </div>
      </div>
    )
  }
}

const mapState = (state, ownProps) => ({
  session: state.session,
  tickets: state.tickets
});

export default connect(mapState, null)(Support);
