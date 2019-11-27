/**
 * Test utilities for the breakscheduler project.
**/
import React from 'react';
import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

export const Bootstrap = ({ store, route, children }) => (
  <MemoryRouter initialEntries={[ route ]}>
    <Provider store={store}>
      {children}
    </Provider>
  </MemoryRouter>
);
