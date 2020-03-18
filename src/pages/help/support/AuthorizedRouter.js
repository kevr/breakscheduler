import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Create from './Create';
import Settings from './Settings';
import TicketBarrier from '../../../components/TicketBarrier';
import Ticket from './Ticket';

const AuthorizedRouter = () => {
  console.log(`AuthorizedRouter.render`);
  return (
    <span>
      <TicketBarrier>
        <Switch>
          <Route
            exact
            path={"/help/support"}
            component={Dashboard}
          />
        </Switch>
      </TicketBarrier>

      <Switch>
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
    </span>
  );
};

export default AuthorizedRouter;
