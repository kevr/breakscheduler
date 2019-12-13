import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Create from './Create';
import Ticket from './Ticket';
import TicketBarrier from '../../../components/TicketBarrier';

const AuthorizedRouter = () => {
  console.log(`AuthorizedRouter.render`);
  return (
    <Switch>
      <TicketBarrier>
        <Route
          exact
          path={"/help/support"}
          component={Dashboard}
        />
        <Route
          exact
          path={"/help/support/ticket/:id"}
          component={Ticket}
        />
        <Route
          exact
          path={"/help/support/createTicket"}
          component={Create}
        />
      </TicketBarrier>
    </Switch>
  );
};

export default AuthorizedRouter;