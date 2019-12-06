import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import Search from './Search';
import config from '../../config.json';
import Reducers from '../../reducers';
import {
  TestRouter,
  createHistory,
  mockPath
} from 'TestUtil';

configure({ adapter: new Adapter() });

let axiosMock;
let container; // Stubbed div#root
let store;     // Stubbed redux store

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
  document.body.removeChild(container);
  container = null;
});

test('Search page default cards', async () => {
  const history = createHistory("/help/search");

  const topics = [
    { id: 1, subject: "Test Subject", body: "Test body." }
  ];

  axiosMock.onGet(mockPath("topics")).reply(200, topics);

  await act(async () => {
    render(
      <TestRouter store={store} history={history}>
        <Search />
      </TestRouter>
      , container
    );
  });

  const cards = document.querySelectorAll(".card");
  expect(cards.length).toBe(1);

  const card = cards[0];
  expect(card.querySelector(".card-title").textContent).toBe("Test Subject");
  expect(card.querySelector("p").textContent).toBe("Test body.");

  // Clicking on a card should open a modal with it's details
  await act(async () => {
    fireEvent.click(card);
  });

  // We should be able to use enzyme.find here, but
  // it returns nothing: investigate why.
  const modal = document.querySelector(".modal.open");
  expect(modal).not.toBeNull();

  expect(modal.querySelector("h4").textContent).toBe("Test Subject");
  expect(modal.querySelector("p").textContent).toBe("Test body.");
});

test('Search page renders filtered topics', async () => {
  const history = createHistory("/help/search");

  const topics = [
    { "id": 1, "subject": "Test Subject", "body": "Test body." },
    { "id": 2, "subject": "Second One", "body": "Next." },
    { "id": 3, "subject": "Another One", "body": "Third one." }
  ];

  axiosMock.onGet(mockPath("topics")).reply(200, topics);

  let object = {
    getByLabelText: null
  };
  await act(async () => {
    const {
      getByLabelText
    } = render(
      <TestRouter store={store} history={history}>
        <Search />
      </TestRouter>
      , container
    );
    object.getByLabelText = getByLabelText;
  });

  expect(object.getByLabelText).not.toBeNull();

  // How is there just one?
  let cards = document.querySelectorAll(".card");
  expect(cards.length).toBe(3);

  // Test our search input field as if we were
  // typing into it.
  let searchInput = object.getByLabelText("Search help topics...");

  // Type "Test" into the search input widget
  await act(async () => {
    fireEvent.change(searchInput, {
      target: {
        value: "Test"
      }
    });
  });

  // Check that we only have "Test" related results
  cards = document.querySelectorAll(".card");
  expect(cards.length).toBe(1);

  let card = cards[0];
  expect(card.querySelector(".card-title").textContent).toBe("Test Subject");
  expect(card.querySelector("p").textContent).toBe("Test body.");

  // Type "Second" into the search input widget
  await act(async () => {
    fireEvent.change(searchInput, {
      target: {
        value: "Second"
      }
    });
  });

  // Check that we only have "Second" related results
  cards = document.querySelectorAll(".card");
  expect(cards.length).toBe(1);

  card = cards[0];
  expect(card.querySelector(".card-title").textContent).toBe("Second One");
  expect(card.querySelector("p").textContent).toBe("Next.");
});

test('Re-render of Search page does not call API', async () => {
  const history = createHistory("/help/search");

  let topics = [
    { "id": 1, "subject": "Test Subject", "body": "Test body." },
    { "id": 2, "subject": "Second One", "body": "Next." },
    { "id": 3, "subject": "Another One", "body": "Third one." }
  ];

  axiosMock.onGet(mockPath("topics")).replyOnce(200, topics);

  // Allow initial topics retrieval to occur.
  let node;
  await act(async () => {
    node = mount((
        <TestRouter store={store} history={history}>
          <Search />
        </TestRouter>
    ), {
      attachTo: document.getElementById("root")
    });
  });
  node.update();
  expect(node.find(".card").length).toBe(3);

  // On the remount, we already have topics in Redux, so
  // the component should skip retrieving anything and
  // it's render should remain the same.
  node.unmount();
  node.mount();
  node.update();
  expect(node.find(".card").length).toBe(3);
});
