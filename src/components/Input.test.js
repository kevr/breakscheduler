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
  TextInput
} from './Input';

configure({ adapter: new Adapter() });

describe('Input component', () => {

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

  test('uses the invalid class when valid prop is false', async () => {
    // We start off with an empty value
    let value = '';

    // Update value through the onChange function
    const onChange = (e) => {
      value = e.target.value;
    };

    const node = mount((
      <TextInput
        id="some-id"
        value={value}
        onChange={onChange}
        valid={false}
        invalidText={"Invalid text input value"}
      />
    ), {
      assignTo: document.getElementById("root")
    });
    node.update();

    const input = node.find("input#some-id");
    expect(input.hasClass("invalid")).toBe(true);

    const helperText = node.find(".helper-text");
    expect(helperText.prop("data-error")).toBe("Invalid text input value");
  });

  test('does not use the invalid class when valid prop is true', async () => {
    // We start off with an empty value
    let value = '';

    // Update value through the onChange function
    const onChange = (e) => {
      value = e.target.value;
    };

    // We also test that className is propagated correctly here
    const node = mount((
      <TextInput
        id="some-id"
        value={value}
        onChange={onChange}
        valid={true}
        invalidText={"Invalid text input value"}
        className="blah"
      />
    ), {
      assignTo: document.getElementById("root")
    });
    node.update();

    const input = node.find("input#some-id");
    expect(input.hasClass("invalid")).toBe(false);

    const helperText = node.find(".helper-text");
    expect(helperText.prop("data-error")).toBe("Invalid text input value");

    const div = node.find("div").first();
    expect(div.hasClass("blah")).toBe(true);
  });

});
