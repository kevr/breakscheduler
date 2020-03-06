import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Create from './Create';
import Settings from './Settings';
import TicketBarrier from '../../../components/TicketBarrier';

const AuthorizedRouter = () => {
  console.log(`AuthorizedRouter.render`);
  return (
    <TicketBarrier>
      <Switch>
        <Route
          exact
          path={"/help/support"}
          component={Dashboard}
        />
        <Route
          exact
          path={"/help/support/createTicket"}
          component={Create}
        />
        <Route
          exact
          path={"/help/support/settings"}
          component={Settings}
        />
      </Switch>
    </TicketBarrier>
  );
};

export default AuthorizedRouter;
