import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import {
  Landing,
  Features,
  Help,
  Product,
  About,
  NotFound
} from './pages';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App flex flexColumn">
        <Switch>
          {/* Home page */}
          <Route exact path="/" component={Landing} />

          {/* Product feature showcase page. */}
          <Route exact path="/features" component={Features} />

          {/* /help landing page. */}
          <Route exact path="/help" component={Help} />

          {/* Search API topics and articles for help with
              the product. Useful for quick information. */}
          <Route exact path="/help/search" component={Help} />

          {/* Support dashboard. */}
          <Route exact path="/help/support" component={Help} />
          <Route exact path="/help/support/login" component={Help} />

          <Route exact path="/help/support/settings" component={Help} />

          {/* Manage support tickets. */}
          <Route exact path="/help/support/tickets/:id" component={Help} />
          <Route exact path="/help/support/createTicket" component={Help} />

          {/* Product download and retrieval page. */}
          <Route exact path="/product" component={Product} />

          {/* About the company. */}
          <Route exact path="/about/team" component={About.Team} />
          <Route exact path="/about/contact" component={About.Contact} />

          {/* 404 Not Found page. */}
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
