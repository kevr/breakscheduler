import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  Search,
  UserManual,
  Support
} from './help';
import ExtendedNavbar from '../components/ExtendedNavbar';
import Layout from './Layout';

class Help extends Component {
  render() {
    const routes = [
      { to: "/help", label: "User Manual" },
      { to: "/help/search", label: "Search" },
      { to: "/help/support", label: "Support" }
    ];

    return (
      <Layout pageTitle="Help Directory">
        <ExtendedNavbar routes={routes} />
        <div style={{ height: "12px" }} />

        <div className="TabContent">
          <Switch>
            {/* User Manual */}
            <Route exact path="/help" component={UserManual} />

            {/* Search */}
            <Route exact path="/help/search" component={Search} />

            {/* Dashboard */}
            <Route exact path="/help/support" component={Support} />

            {/* Login */}
            <Route exact path="/help/support/login" component={Support} />

            {/* Account Settings */}
            <Route exact path="/help/support/settings" component={Support} />

            {/* Ticket */}
            <Route exact path="/help/support/tickets/:id" component={Support} />

            {/* Create */}
            <Route exact path="/help/support/createTicket" component={Support} />
          </Switch>
        </div>
      </Layout>
    )
  }
}


export default Help;
