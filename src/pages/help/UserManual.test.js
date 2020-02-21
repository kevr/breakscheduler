import React from 'react';
import {
  configure,
  mount,
  shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import UserManual from './UserManual';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  createArticle
} from 'MockObjects';

configure({ adapter: new Adapter() });

describe('User Manual page', () => {

  let axiosMock;
  let store;
  let container;

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

  test('bad server response causes catch path', async () => {
    const history = createHistory("/help");

    axiosMock.onGet(mockPath("articles")).reply(500);

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <UserManual />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });

    // We should have Preamble + the two mocked REST articles.
    expect(node.find(".Article").length).toBe(1);
  });

  test('renders', async () => {
    const history = createHistory("/help");

    axiosMock.onGet(mockPath("articles")).reply(200, []);

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <UserManual />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });

    const preamble = node.find("#article_preamble").first();
    expect(preamble).not.toBeNull();
    expect(node.find(".sidenav.open").length).toBe(0);

    // Just test clicking preamble on the sidenav
    const trigger = node.find(".sidenavButton").first();

    // Click on the nav button
    await act(async () => {
      trigger.simulate('click');
    });
    node.update();

    expect(node.find(".sidenav.open").exists()).toBe(true);

    const sidenav = node.find(".sidenav");
    const preambleButton = sidenav.find("a").first();
    // Click the Preamble navigation
    await act(async () => {
      preambleButton.simulate('click');
    });
    node.update();

    expect(node.find(".sidenav.open").exists()).toBe(false);

    // Unmount and mount again to test article persistence
    node.unmount();
    node.mount();
  });

  test('renders with multiple articles', async () => {
    const history = createHistory("/help");
    const articles = [
      createArticle("Article 1", "First article written."),
      createArticle("Article 2", "Second article written.")
    ];
    axiosMock.onGet(mockPath("articles")).reply(200, articles);

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <UserManual />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });
    node.update();

    // We should have Preamble + the two mocked REST articles.
    expect(node.find(".Article").length).toBe(3);

    // Just test clicking preamble on the sidenav
    const trigger = node.find(".sidenavButton").first();

    // Click on the nav button
    await act(async () => {
      trigger.simulate('click');
    });
    node.update();

    // Assert that the sidenav exists and is open.
    const sidenav = node.find(".sidenav.open");
    expect(sidenav.exists()).toBe(true);

    // Second <a> found in the sidenav.
    // Click the second link, expect the sidenav to close.
    const secondLink = sidenav.find("a").at(1);
    await act(async () => {
      secondLink.simulate('click');
    });
    node.update();

    expect(node.find(".sidenav.open").exists()).toBe(false);
  });

});

