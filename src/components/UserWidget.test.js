import React, { Component } from 'react';
import { connect } from 'react-redux';
import { configure, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import {
  TestRouter,
  createHistory,
  mockStore
} from 'TestUtil';
import {
  createUser,
  createAdmin
} from 'MockObjects';
import UserWidget from './UserWidget';

configure({ adapter: new Adapter() });

describe('UserWidget component', () => {

  let store;
  let container;

  beforeEach(() => {
    store = mockStore();
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('default is logged out', async () => {
    const history = createHistory("/help/support");

    const user = createUser("Test User", "test@example.com");
    store.dispatch({ type: "SET_SESSION", session: user });

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <UserWidget />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find(".loginButton").first()).not.toBeNull();
  });

  test('valid user data is logged in', async () => {
    const history = createHistory("/help/support");

    const user = createUser("Test User", "test@example.com");
    store.dispatch({ type: "SET_SESSION", session: user });

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <UserWidget />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });
    node.update();

    // Test when window.confirm is false while clicking on Logout
    window.confirm = jest.fn().mockImplementation(() => false);
    let logout = node.find(".logoutButton").first();
    expect(logout.text()).toBe("Logout");
    logout.simulate('click');

    // Test when window.confirm is true while clickong on Logout
    window.confirm = jest.fn().mockImplementation(() => true)
    logout = node.find(".logoutButton").first();
    expect(logout.text()).toBe("Logout");
    logout.simulate('click');

    // Expect the DOM to have changed; the Login button should take
    // the Logout button's place.
    const login = node.find(".loginButton").first();
    expect(login.text()).toBe("Login");
  });

  test('admin user data shows admin annotations', async () => {
    const history = createHistory("/help/support");

    const admin = createAdmin("Test User", "test@example.com");
    store.dispatch({ type: "SET_SESSION", session: admin });

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <UserWidget />
        </TestRouter>
      ), {
        attachTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find(".userEmail").text())
      .toBe("Logged in as test@example.com [admin]");
  });

});
