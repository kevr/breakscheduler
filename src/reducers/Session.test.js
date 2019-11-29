import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import SessionReducer from './Session';
import config from '../config.json';

test('default SessionReducer returns isValid = false', async () => {
  const state = SessionReducer(undefined, {});
  expect(state).toEqual({ isValid: false });
});

test('SET_SESSION sets session with isValid = true', async () => {
  const state = SessionReducer(undefined, {
    type: "SET_SESSION",
    session: {
      id: 1,
      email: "test@example.com"
    }
  });
  expect(state).toEqual({ id: 1, email: "test@example.com", isValid: true });
});

test('CLEAR_SESSION sets state to default', async () => {
  const state = SessionReducer({
    isValid: true,
    is: 1,
    email: "test@example.com"
  }, {
    type: "CLEAR_SESSION"
  });
  expect(state).toEqual({ isValid: false });
});
