import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loader } from '../../../components';
import Login from './Login';
import Ticket from './Ticket';
import AuthorizedRouter from './AuthorizedRouter';

// This needs to be moved to SessionRouter
const SessionRouter = ({ session, history }) => (
  <Switch>
    <Route
      exact path={"/help/support/tickets/:id"}
      component={Ticket}
    />
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

export default connect(mapState, null)(SessionRouter);
