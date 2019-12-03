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
  Bootstrap,
  mockPath,
  flushPromises
} from 'TestUtil';
import Reducers from './reducers';

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
  await act(async () => {
    render(
      <Bootstrap store={store} route="/">
        <App />
      </Bootstrap>
    , container);
  });

  await waitForElement(() => document.head.querySelector("title"));
  expect(document.head.querySelector("title").textContent)
    .toBe(`${config.appName}`);

  expect(document.querySelector(".Page").getAttribute("title"))
    .toBeNull();
});

test('/about/contact route sets correct title', async () => {
  await act(async () => {
    render(
      <Bootstrap store={store} route="/about/contact">
        <App />
      </Bootstrap>
    , container);
  });

  await expectTitle("Contact Us");
});

test('/about/team route sets correct title', async () => {
  axiosMock.onGet(mockPath("members")).reply(200, [
    {
      id: 1,
      name: "Kevin Morris",
      title: "Software Engineer"
    }
  ]);

  await act(async() => {
    render(
      <Bootstrap store={store} route="/about/team">
        <App />
      </Bootstrap>
    , container);
  });

  await expectTitle("The Team");
});

test('/help route sets correct title', async () => {
  axiosMock.onGet(mockPath("articles")).reply(200, [
    {
      id: 1,
      title: "Getting Started",
      body: "An article!"
    }
  ]);

  await act(async () => {
    render(
      <Bootstrap store={store} route="/help">
        <App />
      </Bootstrap>
    , container);
  });

  await expectTitle("Help Directory");
});

test('/help/search route sets correct title', async () => {
  axiosMock.onGet(mockPath("topics")).reply(200, []);

  await act(async() => {
    render(
      <Bootstrap store={store} route="/help/search">
        <App />
      </Bootstrap>
    , container);
  });

  await expectTitle("Help Directory");
});

/*
test('/help/support route sets correct title', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[ "/help/support" ]}>
        <App />
      </MemoryRouter>
    );
  });

  await expectTitle("Help Directory");
});
*/

test('/random route gives not found', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[ "/random" ]}>
        <App />
      </MemoryRouter>
    );
  });

  await expectTitle("Not Found");
});

test('/features route renders the features page', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[ "/features" ]}>
        <App />
      </MemoryRouter>
    );
  });

  await expectTitle("Features");
});

test('/product route renders the product page', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[ "/product" ]}>
        <App />
      </MemoryRouter>
    );
  });

  await expectTitle("Product");
});

