import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, useParams } from 'react-router-dom';
import { getRequest } from '../../actions/API';
import UserWidget from '../../components/UserWidget';
import Layout from '../Layout';
import Subpages from './support';

class Support extends Component {
  render() {
    const { session } = this.props;

    return (
      <div className="container">
        <div className="row">
          <UserWidget userData={session} />
        </div>

        <div className="Content">
          <Switch>
            {/* Support Login (support/Login.js) */}
            <Route exact path={"/help/support/login"} component={() => (
              <Subpages.Login
                userData={session}
                setSession={this.props.setSession}
              />
            )} />

            {/* Support Authenticated routes (support/Authenticated.js)
                Including:
                  /help/support Dashboard
                  /help/support/createTicket Create a Ticket
                  /help/support/ticket/:id View a Ticket 
                  
                If we are not logged in, we redirect to the Support
                Login page. */}
            <Route path={"/help/support"} component={() => {
              // If we do not have a valid session, redirect to Login.
              if(session.resolved && !session.isValid) {
                this.props.history.push("/help/support/login");
                return (
                  // A .state div we can use for testing purposes, and to
                  // avoid rendering data-dependant components with
                  // an invalid session.
                  <div className="state">{"Redirecting"}</div>
                );
              }

              // Otherwise, render our Authenticated route.
              return (
                <Subpages.Authenticated
                  session={session}
                  tickets={this.props.tickets}
                />
              );
            }} />

          </Switch>
        </div>
      </div>
    )
  }
}

const mapState = (state, ownProps) => ({
  session: state.session,
  tickets: state.tickets
});

const mapDispatch = (dispatch, ownProps) => ({
  setSession: (session) => {
    dispatch({
      type: "SET_SESSION",
      session: session
    });
  }
});

export default connect(mapState, mapDispatch)(Support);
