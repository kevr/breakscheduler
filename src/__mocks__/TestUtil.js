/**
 * Test utilities for the breakscheduler project.
**/
import React from 'react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Reducers from '../reducers';
import config from '../config.json';

// A simple component that sets up a test environment
// for a component by wrapping it with a MemoryRouter
// and a react-redux Provider.
//
// const root = mount(
//   <Bootstrap store={store} route="/">
//     <SomeReduxConnectedOrRoutedComponent />
//   </Bootstrap>
// );
//
export const TestRouter = ({ store, history, children }) => (
  <Router history={history}>
    <Provider store={store}>
      {children}
    </Provider>
  </Router>
);

export const createHistory = (route) => {
  return createMemoryHistory({
    initialEntries: [route]
  });
};

// Generate an API request path with an endpoint
// by abstracting away our JSON configuration.
export const mockPath = (endpoint) =>
  `${config.apiPrefix}/${endpoint}`;

export const mockStore = () => createStore(Reducers);
