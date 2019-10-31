import React from 'react';
import {
  BrowserRouter,
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

const App = () => (
  <div className="App">
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/features" component={Features} />
        <Route exact path="/help" component={Help} />
        <Route exact path="/product" component={Product} />
        <Route exact path="/about/team" component={About.Team} />
        <Route exact path="/about/contact" component={About.Contact} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
