import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  networkError,
  validationError
} from './MessageUtil';

describe('MessageUtil', () => {

  let axiosMock;
  let container;
  let store;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    store = mockStore();
    container = document.createElement('div');
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    axiosMock.reset();
    var title = document.head.querySelector("title");
    if(title)
      document.head.removeChild(title);
    document.body.removeChild(container);
    container = null;
  });

  test('networkError returns the right string', async () => {
    expect(networkError())
      .toBe("Unable to update your details due to a network issue.");
  });

  test('validationError returns identity', async () => {
    const result = validationError("someIdentity");
    expect(result).toBe("someIdentity");
  });

});
