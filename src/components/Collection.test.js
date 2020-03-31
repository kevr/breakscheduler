import React from 'react';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Collection, { Item } from './Collection';

// Setup enzyme
configure({ adapter: new Adapter() });

describe('Collection component', () => {

  let container;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('renders with two items', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Collection>
          <Item>One</Item>
          <Item>Two</Item>
        </Collection>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find("li").length).toBe(2);
    expect(node.find("li").at(0).text()).toBe("One");
    expect(node.find("li").at(1).text()).toBe("Two");
  });

});
