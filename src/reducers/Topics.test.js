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

let container;

beforeEach(() => {
  container = document.createElement('div');
  container.id = "root";
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('default TopicsReducer returns an empty array', async () => {
  const state = TopicsReducer(undefined, {});
  expect(state).toEqual([]);
});

test('PUSH_TOPICS concats topics to the state array', async () => {
  const state = TopicsReducer(undefined, {
    type: "PUSH_TOPICS",
    topics: [1, 2]
  });
  expect(state).toEqual([1, 2]);
});

test('CLEAR_TOPICS sets state to an empty array', async () => {
  const state = TopicsReducer([
    1, 2
  ], {
    type: "CLEAR_TOPICS"
  });
  expect(state).toEqual([]);
});
