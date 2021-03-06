import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import Search from './Search';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  createTopic
} from 'MockObjects';

configure({ adapter: new Adapter() });

let axiosMock;
let container; // Stubbed div#root
let store;     // Stubbed redux store

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
  document.body.removeChild(container);
  container = null;
});

test('Search page default cards', async () => {
  const history = createHistory("/help/search");
  const topic = createTopic("Test Subject", "Test body.");
  const topics = [topic];

  axiosMock.onGet(mockPath("topics")).reply(200, topics);
  axiosMock.onGet(mockPath("articles")).reply(200, []);

  let node;
  await act(async () => {
    node = mount((
      <TestRouter store={store} history={history}>
        <Search />
      </TestRouter>
    ), {
      assignTo: document.getElementById("root")
    });
  });
  node.update();

  const cards = node.find(".card");
  expect(cards.length).toBe(1);

  const card = cards.first();
  expect(card.find(".card-title").text()).toBe("Test Subject");
  expect(card.find("p").text()).toBe("Test body.");

  // Clicking on a card should open a modal with it's details
  await act(async () => {
    card.simulate('click');
  });
  node.update();

  const modal = node.find(".modal.open");
  expect(modal).not.toBeNull();

  expect(modal.find("h4").text()).toBe("Test Subject");
  expect(modal.find("p").text()).toBe("Test body.");

  // We should be able to simulate closing the modal by
  // clicking somewhere else, but we cannot.
  // materialize-css seems to have this issue during testing,
  // so we manually test against Modal in Modal.test.js.
});

test('Search page gets 500 from API', async () => {
  const history = createHistory("/help/search");
  const topics = [
    createTopic("Test Subject", "Test body."),
    createTopic("Second One", "Next."),
    createTopic("Another One", "Third one.")
  ];

  axiosMock.onGet(mockPath("topics")).reply(500);

  // Reply with some mocked out articles to trigger the article typing path
  // on line 189 of Search.js
  axiosMock.onGet(mockPath("articles")).reply(500);

  let node;
  await act(async () => {
    node = mount((
      <TestRouter store={store} history={history}>
        <Search />
      </TestRouter>
    ), {
      assignTo: document.getElementById("root")
    });
  });
  node.update();

  expect(node.find(".card").length).toBe(0);
});

test('Search page renders filtered topics', async () => {
  const history = createHistory("/help/search");
  const topics = [
    createTopic("Test Subject", "Test body."),
    createTopic("Second One", "Next."),
    createTopic("Another One", "Third one.")
  ];

  axiosMock.onGet(mockPath("topics")).reply(200, topics);

  // Reply with some mocked out articles to trigger the article typing path
  // on line 189 of Search.js
  axiosMock.onGet(mockPath("articles")).reply(200, [
    { id: 1, body: "Article Body 1", subject: "Article 1" },
    { id: 2, body: "Article Body 2", subject: "Article 2" },
  ]);

  let node;
  await act(async () => {
    node = mount((
      <TestRouter store={store} history={history}>
        <Search />
      </TestRouter>
    ), {
      assignTo: document.getElementById("root")
    });
  });
  node.update();

  // By default, no filters are used. Expect all articles and topics
  // to be present on the Search page.
  let cards = node.find(".card");
  expect(cards.length).toBe(5);

  // Test with User Manual alone checked.
  let manualCheckbox = node.find("input#user-manual-checkbox");
  await act(async () => {
    manualCheckbox.simulate('change', {
      target: {
        checked: true
      }
    });
  });
  node.update();

  cards = node.find(".card");
  expect(cards.length).toBe(2);

  // Test with User Manual and QnA checked
  let qnaCheckbox = node.find("input#qna-checkbox");
  await act(async () => {
    qnaCheckbox.simulate('change', {
      target: {
        checked: true
      }
    });
  });
  node.update();

  cards = node.find(".card");
  expect(cards.length).toBe(5);

  // Test with QnA checked, but not User Manual
  manualCheckbox.update();
  await act(async () => {
    manualCheckbox.simulate('change', {
      target: {
        checked: false
      }
    });
  });
  node.update();

  cards = node.find(".card");
  expect(cards.length).toBe(3);

  const searchInput = node.find("input#search-input");

  // Type "Test" into the search input widget
  await act(async () => {
    searchInput.simulate('change', {
      target: {
        value: "Test"
      }
    });
  });
  node.update();

  // Check that we only have "Test" related results
  cards = node.find(".card");
  expect(cards.length).toBe(1);

  let card = cards.at(0);
  expect(card.find(".card-title").text()).toBe("Test Subject");
  expect(card.find("p").text()).toBe("Test body.");

  // Type "Second" into the search input widget
  await act(async () => {
    searchInput.simulate('change', {
      target: {
        value: "Second"
      }
    });
  });
  node.update();

  // Check that we only have "Second" related results
  cards = node.find(".card");
  expect(cards.length).toBe(1);

  card = cards.at(0);
  expect(card.find(".card-title").text()).toBe("Second One");
  expect(card.find("p").text()).toBe("Next.");

  // Type "Second" into the search input widget
  await act(async () => {
    searchInput.simulate('change', {
      target: {
        value: "\"Third one.\""
      }
    });
  });
  node.update();

  cards = node.find(".card");
  expect(cards.length).toBe(1);

  card = cards.at(0);
  expect(card.find(".card-title").text()).toBe("Another One");
});

test('Re-render of Search page does not call API', async () => {
  const history = createHistory("/help/search");
  const topics = [
    createTopic("Test Subject", "Test body."),
    createTopic("Second One", "Next."),
    createTopic("Another One", "Third one.")
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
