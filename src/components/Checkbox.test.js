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
  Checkbox
} from './Input';

configure({ adapter: new Adapter() });

describe('Checkbox component', () => {

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

  test('renders and toggles', async () => {
    let checked = false;

    const onChange = (e) => {
      e.preventDefault();
      checked = !checked;
    };

    let node;
    await act(async () => {
      node = mount((
        <Checkbox
          id="some-id"
          label="Some Label"
          className="targetCheckbox"
          checked={checked}
          onChange={onChange}
        />
      ), {
        assignTo: document.getElementById("root")
      });
      node.update();
    });

    let checkbox = node.update().find("input#some-id");
    await act(async () => {
      checkbox.simulate('change', {
        target: {
          checked: true
        }
      });
      node.update();
    });
    node.update();

  });

});
