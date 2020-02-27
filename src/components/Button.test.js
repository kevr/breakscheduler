import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  Button
} from './Input';

configure({ adapter: new Adapter() });

describe('Button component', () => {

  let axiosMock;
  let container;
  let store;

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
    var title = document.head.querySelector("title");
    if(title)
      document.head.removeChild(title);
    document.body.removeChild(container);
    container = null;
  });

  test('renders', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Button
          id="some-id"
          disabled={false}
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    let button = node.find("button#some-id");

    await act(async () => {
      button.simulate('click');
    });

    expect(button.length).toBe(1);
  });

});
