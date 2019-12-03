import React, { Component } from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { configure, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import UserWidget from './UserWidget';
import Reducers from '../reducers';
import {
  Bootstrap,
  flushPromises
} from 'TestUtil';

configure({ adapter: new Adapter() });

// UserWidget manager component mockup, which
// ties in with Redux.
class UserWidgetManager extends Component {
  componentDidMount() {
    // Set userData when we mount up
    this.props.setSession({
      id: 1,
      email: "test@example.com"
    });
  }

  render() {
    return (
      <UserWidget userData={this.props.session} />
    )
  }
}

const mapState = (state, ownProps) => ({
  session: state.session
});

const mapDispatch = (dispatch, ownProps) => ({
  setSession: (session) => dispatch({
    type: "SET_SESSION",
    session: session
  })
});

const Mock = connect(mapState, mapDispatch)(UserWidgetManager);

describe('UserWidget component', () => {

  // Globals, setUp/tearDown hooks.
  let store;
  let container;

  beforeEach(() => {
    store = createStore(Reducers);
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('default is logged out', async () => {
    const userData = {
      isValid: false
    };
    const node = mount((
      <Bootstrap store={store} route="/help/support">
        <UserWidget userData={userData} />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();

    expect(node.find(".loginButton").first()).not.toBeNull();
  });

  test('valid user data is logged in', async () => {
    const node = mount((
      <Bootstrap store={store} route="/help/support">
        <Mock />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises(); 

    // Test when window.confirm is false while clicking on Logout
    window.confirm = jest.fn().mockImplementation(() => false);
    let logout = node.find("a").at(1);
    expect(logout.text()).toBe("Logout");
    logout.simulate('click');

    // Expect nothing to happen; Logout should still be there.
    expect(node.find(".logoutButton").first()).not.toBeNull();

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
    const userData = {
      isValid: true,
      id: 1,
      name: "Kevin Morris",
      email: "test@example.com",
      type: "admin"
    };
    const node = mount((
      <Bootstrap store={store} route="/help/support">
        <UserWidget
          userData={userData}
        />
      </Bootstrap>
    ), {
      attachTo: document.getElementById("root")
    });
    await flushPromises();

    expect(node.find(".userEmail").text())
      .toBe("Logged in as test@example.com [admin]");
  });

});
