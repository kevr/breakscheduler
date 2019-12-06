import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { createStore } from 'redux';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Badge from './Badge';

// Configure enzyme
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

  test('renders', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Badge id="badge-id">
          {"Test"}
        </Badge>
      ), {
        assignTo: document.getElementById("root")
      });
    });

    expect(node.find(".colorBadge").exists()).toBe(true);
  });

  test('renders with className', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Badge id="badge-id"
          className="test"
        >
          {"Test"}
        </Badge>
      ), {
        assignTo: document.getElementById("root")
      });
    });

    expect(node.find(".colorBadge.test").exists()).toBe(true);
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

  test('valid text produces the right className', async () => {
    let className = Badge.getBadgeClass("open");
    expect(className).toBe("green lighten-3 black-text");

    className = Badge.getBadgeClass("escalated");
    expect(className).toBe("yellow lighten-3 black-text");

    className = Badge.getBadgeClass("closed");
    expect(className).toBe("red lighten-2 white-text");
  });

  test('valid text produces the right display text', async () => {
    let text = Badge.getBadgeText("open");
    expect(text).toBe("Open");

    text = Badge.getBadgeText("escalated");
    expect(text).toBe("Escalated");

    text = Badge.getBadgeText("closed");
    expect(text).toBe("Closed");
  });
});
