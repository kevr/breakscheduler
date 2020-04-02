import React from 'react';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Col from './Col';

// Setup enzyme
configure({ adapter: new Adapter() });

describe('Container component', () => {
  
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

  test('renders with all responsive sizes', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Col s={6} m={6} l={6} xl={6}>
          {"First"}
        </Col>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    // Uses s6, m6, l6, and xl6
    const expectedClasses = ["s6", "m6", "l6", "xl6"];
    expectedClasses.map((cls) => {
      expect(node.find(".col").hasClass(cls)).toBe(true);
      return null;
    });
  });

  test('renders with just small', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Col s={6}>
          {"First"}
        </Col>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find(".col").hasClass("s6")).toBe(true);
  });

  test('renders with just medium', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Col m={6}>
          {"First"}
        </Col>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find(".col").hasClass("m6")).toBe(true);
  });
});
