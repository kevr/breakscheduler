/**
 * Test utilities for the breakscheduler project.
**/
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';
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
export const Bootstrap = ({ store, route, children }) => (
  <MemoryRouter initialEntries={[ route ]}>
    <Provider store={store}>
      {children}
    </Provider>
  </MemoryRouter>
);

// Generate an API request path with an endpoint
// by abstracting away our JSON configuration.
export const mockPath = (endpoint) =>
  `${config.apiPrefix}/${endpoint}`;

// (Credit: https://medium.com/@lucksp_22012/
// jest-enzyme-react-testing-with-async-componentdidmount-7c4c99e77d2d)
//
// A simple async function used in tests to wait
// until pending promises in React are resolved.
// Particularly useful for an enzyme comp workflow,
// an example of mounting and waiting for promises:
//
// const root = mount(<Component />);
// await flushPromises();
// expect(root.find(".textField").text()).toBe("Component Text");
//
export const flushPromises = () =>
  new Promise(resolve => setImmediate(resolve));

