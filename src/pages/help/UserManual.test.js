import React from 'react';
import { createStore } from 'redux';
import {
  configure,
  mount,
  shallow
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import UserManual from './UserManual';
import Reducers from '../../reducers';
import {
  Bootstrap,
  mockPath,
  flushPromises
} from '../../lib/TestUtils';

configure({ adapter: new Adapter() });

describe('User Manual page', () => {

  let axiosMock;
  let store;
  let container;

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

  test('renders', async () => {
    axiosMock.onGet(mockPath("articles")).reply(200, []);
    const node = mount((
      <Bootstrap store={store} route="/help">
        <UserManual />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();

    const preamble = node.find("#article_preamble").first();
    expect(preamble).not.toBeNull();
    expect(node.find(".sidenav.open").length).toBe(0);

    // Just test clicking preamble on the sidenav
    const trigger = node.find(".sidenavButton").first();

    // Click on the nav button
    trigger.simulate('click', {
      preventDefault: () => {
        return true;
      }
    });
    await flushPromises();
    node.update();
    expect(node.find(".sidenav.open").exists()).toBe(true);

    const sidenav = node.find(".sidenav");
    const preambleButton = sidenav.find("a").first();
    // Click the Preamble navigation
    preambleButton.simulate('click', {});
    await flushPromises();
    node.update();
    expect(node.find(".sidenav.open").exists()).toBe(false);
  });

  test('renders with multiple articles', async () => {
    axiosMock.onGet(mockPath("articles")).reply(200, [
      { id: 1, topic: "Article 1", body: "First article written." },
      { id: 2, topic: "Article 2", body: "Second article written." }
    ]);
    const node = mount((
      <Bootstrap store={store} route="/help">
        <UserManual />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();
    node.update();

    // We should have Preamble + the two mocked REST articles.
    expect(node.find(".Article").length).toBe(3);

    // Just test clicking preamble on the sidenav
    const trigger = node.find(".sidenavButton").first();

    // Click on the nav button
    trigger.simulate('click', {
      preventDefault: () => {
        return true;
      }
    });
    await flushPromises();
    node.update();

    // Assert that the sidenav exists and is open.
    const sidenav = node.find(".sidenav.open");
    expect(sidenav.exists()).toBe(true);

    // Second <a> found in the sidenav.
    // Click the second link, expect the sidenav to close.
    const secondLink = sidenav.find("a").at(1);
    secondLink.simulate('click', {});

    node.update();
    expect(node.find(".sidenav.open").exists()).toBe(false);
  });

});

