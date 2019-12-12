import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Modal from './Modal';

configure({ adapter: new Adapter() });

describe('Modal component', () => {

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

  test('opens and closes', async () => {
    let node;
    await act(async () => {
      node = mount((
        <Modal
          id="my-modal"
          trigger={(
            <div className="card">
              <div className="card-content">
                {"Open Modal"}
              </div>
            </div>
          )}
        >
          <h4>{"Content"}</h4>
        </Modal>
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    await act(async () => {
      node.find(".card").simulate('click');
    });
    node.update();
    expect(node.find(".modal").hasClass("open")).toBe(true);

    // Manually run the Modal's close function. In browser,
    // materialize-css's M.Modal.init instance automatically
    // closes when the user clicks outside of an opened modal.
    //
    // In testing, however, it does not seem to. This should
    // receive further investigation to prove whether or not
    // materialize-css can be tested.
    //
    await act(async () => {
      node.instance().close();
    });
    node.update();
    expect(node.find(".modal").hasClass("open")).toBe(false);
  });

});
