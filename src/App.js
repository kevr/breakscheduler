import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom';
import {
  Landing,
  NotFound
} from './pages';
import './App.css';

const App = () => (
  <div className="App">
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
