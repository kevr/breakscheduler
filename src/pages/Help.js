import React, { Component } from 'react';
import M from 'materialize-css';
import { Switch, Route } from 'react-router-dom';
import {
  Search,
  UserManual,
  Support
} from './help';
import ExtendedNavbar from '../components/ExtendedNavbar';
import { getRequest } from '../actions/API';
import Layout from './Layout';
import config from '../config.json';

class Help extends Component {
  render() {
    const routes = [
      { to: "/help", label: "User Manual" },
      { to: "/help/search", label: "Search" }
    ];

    return (
      <Layout pageTitle="Help Directory">
        <ExtendedNavbar routes={routes} />

        <div className="TabContent">
          <Switch>
            <Route exact path="/help/search" component={Search} />
            {/* <Route exact path="/help/support" component={Support} /> */}
            <Route exact path="/help" component={UserManual} />
          </Switch>
        </div>
      </Layout>
    )
  }
}


export default Help;
