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
import mockAxios from 'jest-mock-axios';
import axios from 'axios';
import Search from './Search';
import config from '../../config.json';
import Reducers from '../../reducers';
import { Bootstrap } from '../../lib/TestUtils';

configure({ adapter: new Adapter() });

let container; // Stubbed div#root
let store;     // Stubbed redux store

// Seperate setUp and tearDown so we can run
// them manually in tests when needed.
const setUp = () => {
  container = document.createElement('div');
  container.id = "root";
  document.body.appendChild(container);
};

const tearDown = () => {
  mockAxios.reset();
  document.body.removeChild(container);
  container = null;
};

beforeEach(() => {
  store = createStore(Reducers);
  setUp();
});
afterEach(tearDown);

test('Search page default cards', () => {
  const topics = [
    { id: 1, subject: "Test Subject", body: "Test body." }
  ];

  const node = mount((
    <Bootstrap store={store} route="/help/search">
      <Search />
    </Bootstrap>
  ), {
    attachTo: document.getElementById("root")
  });

  expect(mockAxios.request).toBeCalled();
  mockAxios.mockResponse({ data: topics });
  node.update();

  const cards = node.find(".card");
  expect(cards.length).toBe(1);

  const card = cards.at(0);
  expect(card.find(".card-title").text()).toBe("Test Subject");
  expect(card.find("p").text()).toBe("Test body.");

  // Clicking on a card should open a modal with it's details
  card.simulate('click');

  node.update();

  // We should be able to use enzyme.find here, but
  // it returns nothing: investigate why.
  const modal = document.querySelector(".modal.open");
  expect(modal).not.toBeNull();

  expect(modal.querySelector("h4").textContent).toBe("Test Subject");
  expect(modal.querySelector("p").textContent).toBe("Test body.");
});

test('Search page renders filtered topics', async () => {
  const topics = [
    { "id": 1, "subject": "Test Subject", "body": "Test body." },
    { "id": 2, "subject": "Second One", "body": "Next." },
    { "id": 3, "subject": "Another One", "body": "Third one." }
  ];

  const {
    getByLabelText
  } = render(
    <Bootstrap store={store} route="/help/search">
      <Search />
    </Bootstrap>
    , container
  );

  expect(mockAxios.request).toBeCalled();

  mockAxios.mockResponse({
    data: topics
  });

  // How is there just one?
  let cards = document.querySelectorAll(".card");
  expect(cards.length).toBe(3);

  // Test our search input field as if we were
  // typing into it.
  let searchInput = getByLabelText("Search help topics...");
  fireEvent.change(searchInput, {
    target: {
      value: "Test"
    }
  });

  cards = document.querySelectorAll(".card");
  expect(cards.length).toBe(1);

  let card = cards[0];
  expect(card.querySelector(".card-title").textContent).toBe("Test Subject");
  expect(card.querySelector("p").textContent).toBe("Test body.");

  fireEvent.change(searchInput, {
    target: {
      value: "Second"
    }
  });

  cards = document.querySelectorAll(".card");
  expect(cards.length).toBe(1);

  card = cards[0];
  expect(card.querySelector(".card-title").textContent).toBe("Second One");
  expect(card.querySelector("p").textContent).toBe("Next.");
});

test('Re-render of Search page does not call API', () => {
  let topics = [
    { "id": 1, "subject": "Test Subject", "body": "Test body." },
    { "id": 2, "subject": "Second One", "body": "Next." },
    { "id": 3, "subject": "Another One", "body": "Third one." }
  ];

  const node = mount(
    <Bootstrap store={store} route="/help/search">
      <Search />
    </Bootstrap>
  );

  expect(mockAxios.request).toBeCalled();
  mockAxios.mockResponse({
    data: topics
  });

  node.update();
  expect(node.find(".card").length).toBe(3);

  mockAxios.reset();
  node.unmount();
  node.mount();
  expect(mockAxios.request).not.toBeCalled();

  expect(node.find(".card").length).toBe(3);
});
