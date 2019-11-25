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
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import App from './App';

let container;

beforeEach(() => {
  container = document.createElement('div');
  container.id = "root";
  document.body.appendChild(container);
});

afterEach(() => {
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
      <MemoryRouter initialEntries={[ "/" ]}>
        <App />
      </MemoryRouter>
    , container);
  });

  await waitForElement(() => document.head.querySelector("title"));
  expect(document.head.querySelector("title").textContent)
    .toBe(`${config.appName}`);

  expect(document.querySelector(".Page").getAttribute("title"))
    .toBeNull();
});

test('/about/contact route sets correct title', async() => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[ "/about/contact" ]}>
        <App />
      </MemoryRouter>
    , container);
  });

  await expectTitle("Contact Us");
});

test('/about/team route sets correct title', async () => {
  var axiosMock = new MockAdapter(axios);
  axiosMock.onGet(`${config.apiPrefix}/members`).reply(200, [
    {
      id: 1,
      name: "Kevin Morris"
    }
  ]);

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[ "/about/team" ]}>
        <App />
      </MemoryRouter>
    , container);
  });

  await expectTitle("The Team");
});

test('/help route sets correct title', async () => {
  var axiosMock = new MockAdapter(axios);
  axiosMock.onGet(`${config.apiPrefix}/articles`).reply(200, [
    {
      id: 1,
      title: "Getting Started",
      body: "An article!"
    }
  ]);

  await act(async () => {
    render(
      <MemoryRouter initialEntries={[ "/help" ]}>
        <App />
      </MemoryRouter>
    );
  });

  await expectTitle("Help Directory");
});

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
