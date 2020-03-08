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
import TopicsReducer from './Topics';
import config from '../config.json';

test('default TopicsReducer returns an empty array', async () => {
  const state = TopicsReducer(undefined, {});
  expect(state.resolved).toBe(false);
  expect(state.data).toEqual([]);
});

test('PUSH_TOPICS concats topics to the state array', async () => {
  const state = TopicsReducer(undefined, {
    type: "SET_TOPICS",
    topics: [1, 2]
  });
  expect(state.resolved).toBe(true);
  expect(state.data).toEqual([1, 2]);
});

test('CLEAR_TOPICS sets state to an empty array', async () => {
  const state = TopicsReducer({
    resolved: false,
    data: [1, 2]
  }, {
    type: "CLEAR_TOPICS"
  });
  expect(state.resolved).toBe(true); 
  expect(state.data).toEqual([]);
});
