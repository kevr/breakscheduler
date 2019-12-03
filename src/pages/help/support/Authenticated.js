import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  useParams
} from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../../../components/Loader';
import Dashboard from './Dashboard';
import Ticket from './Ticket';
import Create from './Create';
import NotFound from '../../NotFound';
import {
  getRequest
} from '../../../actions/API';

// This component should be used by a Redux-bound
// parent who has access to state.session and
// state.tickets.
//
const TicketWrapper = ({ session, tickets }) => {
  const { id } = useParams();
  const realId = parseInt(id);
  console.log(`URL Parameter (id): ${id}`);
  console.log(`Using tickets: ${JSON.stringify(tickets)}`);

  const ticket = tickets.data.find(t => t.id === realId);
  console.log(`Using ticket with ID(${realId}): ${JSON.stringify(ticket)}`);

  // Return our original ticket route with provided props.
  return <Ticket session={session} ticket={ticket} />;
};

class Authenticated extends Component {
  componentDidMount() {
    const getSession = () => {
      return getRequest("users/me").then((response) => response.data);
    };

    const getTickets = () => {
      getRequest("tickets").then((response) => {
        const output = JSON.stringify(response.data);
        console.log(`Got tickets: ${output}`);
        this.props.setTickets(response.data);
      }).catch((error) => {
        console.log(error);
      });
    };

    // Autometically grab session data when mounting
    // an Authenticated page.
    if(!this.props.session.resolved) {
      getSession().then((session) => {
        const data = Object.assign({}, session, {
          isValid: true,
          resolved: true
        });
        console.log(`Got session data: ${JSON.stringify(data)}`);

        this.props.setSession(data);

        // We now have to retrieve tickets, if we have any.
        getTickets();
      }).catch((error) => {
        // Received an HTTP error while trying to retrieve
        // information about our user session.
        console.error(error);

        // Clear session to tell our app that we're resolved.
        this.props.clearSession();
      });
    } /* else if(this.props.session.isValid) {
      // Otherwise, if we've already resolved and we're
      // valid, then retrieve tickets.
      getTickets();
    }
    */
  }

  render() {
    const { session, tickets } = this.props;
    if(!session.resolved) {
      return <Loader />;
    }

    return (
      <Switch>
        <Route exact
          path="/help/support"
          component={() => <Dashboard {...this.props} />}
        />
        <Route exact
          path="/help/support/ticket/:id"
          component={() => {
            console.log("Hit support ticket route");
            return (
              <TicketWrapper {...this.props} />
            );
          }}
        />
        <Route exact
          path="/help/support/createTicket"
          component={() => <Create {...this.props} />}
        />

        {/* Otherwise, the NotFound component should be
            rendered from the App component. */}
      </Switch>
    );
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  setSession: (session) => dispatch({
    type: "SET_SESSION",
    session: session
  }),
  clearSession: () => dispatch({
    type: "CLEAR_SESSION"
  }),
  setTickets: (tickets) => dispatch({
    type: "SET_TICKETS",
    tickets: tickets
  })
});

export default connect(null, mapDispatch)(Authenticated);
