import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom';
import {
  createStore,
  combineReducers
} from 'redux';
import { Provider } from 'react-redux';
import Reducers from './reducers';
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
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/features" component={Features} />

          {/* Passthrough /help to the routed Help page, which
          contains internal routes to different tabs of it's nav. */}
          <Route exact path="/help" component={Help} />
          <Route exact path="/help/search" component={Help} />
          {/* <Route exact path="/help/support" component={Help} /> */}

          <Route exact path="/product" component={Product} />
          <Route exact path="/about/team" component={About.Team} />
          <Route exact path="/about/contact" component={About.Contact} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
