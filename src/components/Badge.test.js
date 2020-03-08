import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Badge from './Badge';

configure({ adapter: new Adapter() });

describe('Badge component', () => {

  let container;

  beforeEach(() => {
    localStorage.clear();
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('renders open badge', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Badge
          id="badge-id"
          value="open"
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });

    expect(node.find("#badge-id").at(1).hasClass("green")).toBe(true);
    expect(node.find("#badge-id").at(1).text()).toBe("Open");
  });

  test('renders escalated badge', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Badge
          id="badge-id"
          value="escalated"
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });

    expect(node.find("#badge-id").at(1).hasClass("yellow")).toBe(true);
    expect(node.find("#badge-id").at(1).text()).toBe("Escalated");
  });

  test('renders closed badge', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Badge
          id="badge-id"
          value="closed"
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });

    expect(node.find("#badge-id").at(1).hasClass("red")).toBe(true);
    expect(node.find("#badge-id").at(1).text()).toBe("Closed");
  });

  test('invalid text given to getBadgeClass throws', async () => {
    expect(() => {
      Badge.getBadgeClass("blah");
    }).toThrow();
  });

  test('invalid text given to getBadgeText throws', async () => {
    expect(() => {
      Badge.getBadgeText("blah");
    }).toThrow();
  });

});
