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
import Ticket from './Ticket';
import SessionRouter from './SessionRouter';
import AuthenticationBarrier from '../../../components/AuthenticationBarrier';

// This needs to be moved to SessionRouter
const SupportRouter = () => (
  <AuthenticationBarrier>
    <Switch>
      <Route
        exact
        path={"/help/support/tickets/:id"}
        component={Ticket}
      />
      <Route
        path={"/help/support"}
        component={SessionRouter}
      />
    </Switch>
  </AuthenticationBarrier>
);

export default SupportRouter;
