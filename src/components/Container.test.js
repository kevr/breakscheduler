import React from 'react';
import { act } from 'react-dom/test-utils';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Container from './Container';
import Row from './Row';
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

  test('renders a grid', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Container>
          <Row>
            <Col s={6}>
              {"First"}
            </Col>
            <Col s={6}>
              {"Second"}
            </Col>
          </Row>
        </Container>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(node.find(".container").find(".row").find(".col").length).toBe(2);
    expect(node.find(".col").at(0).text()).toBe("First");
    expect(node.find(".col").at(1).text()).toBe("Second");
  });
});
