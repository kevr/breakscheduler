import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import App from './App';
import Search from './pages/help/Search';
import config from './config.json';
import {
  TestRouter,
  createHistory,
  mockPath,
  flushPromises
} from 'TestUtil';
import Reducers from './reducers';

let history;
let axiosMock;
let container;
let store;

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

beforeEach(() => {
  store = createStore(Reducers);
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

const expectTitle = async (title) => {
  await waitForElement(() => document.head.querySelector("title"));
  expect(document.head.querySelector("title").textContent)
    .toBe(`${config.appName} - ${title}`);

  expect(document.querySelector(".Page").getAttribute("title"))
    .toBe(title);
}

test('/ route sets correct title', async () => {
  const history = createHistory("/");
  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    , container);
  });
  expect(history.location.pathname).toBe("/");

  await waitForElement(() => document.head.querySelector("title"));
  expect(document.head.querySelector("title").textContent)
    .toBe(`${config.appName}`);

  expect(document.querySelector(".Page").getAttribute("title"))
    .toBeNull();
});

test('/about/contact route sets correct title', async () => {
  const history = createHistory("/about/contact");
  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    , container);
  });
  expect(history.location.pathname).toBe("/about/contact");

  await expectTitle("Contact Us");
});

test('/about/team route sets correct title', async () => {
  const history = createHistory("/about/team");

  axiosMock.onGet(mockPath("members")).reply(200, [
    {
      id: 1,
      name: "Kevin Morris",
      title: "Software Engineer"
    }
  ]);

  await act(async() => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    , container);
  });
  expect(history.location.pathname).toBe("/about/team");

  await expectTitle("The Team");
});

test('/help route sets correct title', async () => {
  const history = createHistory("/help");

  axiosMock.onGet(mockPath("articles")).reply(200, [
    {
      id: 1,
      title: "Getting Started",
      body: "An article!"
    }
  ]);

  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    , container);
  });

  expect(history.location.pathname).toBe("/help");

  await expectTitle("Help Directory");
});

test('/help/search route sets correct title', async () => {
  const history = createHistory("/help/search");
  axiosMock.onGet(mockPath("topics")).reply(200, []);

  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    , container);
  });

  expect(history.location.pathname).toBe("/help/search");

  await expectTitle("Help Directory");
});

/* This needs to be tested with the others.
test('/help/support route sets correct title', async () => {
  const history = createHistory("/help/support");
  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    );
  });

  await expectTitle("Help Directory");
});
*/

test('/random route gives not found', async () => {
  const history = createHistory("/random");
  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    );
  });
  expect(history.location.pathname).toBe("/random");

  await expectTitle("Not Found");
});

test('/features route renders the features page', async () => {
  const history = createHistory("/features");
  await act(async () => {
    render(
      <TestRouter store={store} history={history}>>
        <App />
      </TestRouter>
    );
  });
  expect(history.location.pathname).toBe("/features");

  await expectTitle("Features");
});

test('/product route renders the product page', async () => {
  const history = createHistory("/product");
  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <App />
      </TestRouter>
    );
  });
  expect(history.location.pathname).toBe("/product");

  await expectTitle("Product");
});

