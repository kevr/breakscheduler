// Internal Support SupportRouter
//
// Our Support pages require user authorization. This router's job
// is to firewall paths within /help/support.
//
// If a user is already logged in, /help/support/login will be
// redirected to /help/support. If a user is not logger in,
// /help/support will redirect to /help/support/login.
//
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from '../../../components';
import Login from './Login';
import AuthorizedRouter from './AuthorizedRouter';

const SupportRouter = ({ session, history }) => (
  <Switch>
    <Route
      exact
      path={"/help/support/login"}
      component={(props) => {
        if(!session.resolved)
          return <Loader />;

        // If we are already logged in, redirect to Dashboard
        if(session.isValid)
          props.history.push("/help/support");

        return <Login />;
      }}
    />
    <Route
      path={"/help/support"}
      component={(props) => {
        if(!session.resolved)
          return <Loader />;

        // If we are not logged in, redirect to Login
        if(!session.isValid)
          props.history.push("/help/support/login");

        return <AuthorizedRouter />;
      }}
    />
  </Switch>
);

const mapState = (state, ownProps) => ({
  session: state.session
});

export default connect(mapState, null)(SupportRouter);
