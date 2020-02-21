import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import App from '../App';
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

describe('Landing page', () => {
  test('renders and unmounts correctly', async () => {
    const history = createHistory("/");

    jest.spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => 100);

    document.querySelector = jest.fn().mockImplementation(() => ({ clientHeight: 100 }));

    let node;
    await act(async () => {
      node = mount((
        <TestRouter store={store} history={history}>
          <App />
        </TestRouter>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    await act(async () => {
      node.unmount();
    });
  });
});
