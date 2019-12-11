import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Paginator from './Paginator';

// Configure enzyme
configure({ adapter: new Adapter() });

describe('Paginator component', async () => {

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

  // This test comprehensively tests the onChange handler by
  // navigating back and forth through a complete Paginator
  // page set.
  test('calls onChange with correct start and end', async () => {
    let dataStart, dataEnd;
    const onChange = (dataStart_, dataEnd_) => {
      dataStart = dataStart_;
      dataEnd = dataEnd_;
    };

    let node;
    await act(async () => {
      node = mount((
        <Paginator
          id="paginator-element"
          dataSize={100}
          pageSize={10}
          onChange={onChange}
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(dataStart).toBe(0);
    expect(dataEnd).toBe(10);

    const ul = node.find("ul");
    const prevPage = ul.find("li").first().find("a");
    const nextPage = ul.find("li").last().find("a");

    // prevPage doesn't change anything.
    await act(async () => {
      prevPage.simulate('click');
    });
    expect(dataStart).toBe(0);
    expect(dataEnd).toBe(10);

    await act(async () => {
      nextPage.simulate('click');
    });
    // This looks off-by-one.
    expect(dataStart).toBe(10);
    expect(dataEnd).toBe(20);

    // prevPage goes back to the first page.
    await act(async () => {
      prevPage.simulate('click');
    });
    expect(dataStart).toBe(0);
    expect(dataEnd).toBe(10);

    const pageFourButton = ul.find("li").at(4).find("a");
    await act(async () => {
      pageFourButton.simulate('click');
    });
    expect(dataStart).toBe(30);
    expect(dataEnd).toBe(40);

    // Now, let's go next six times to get to the 10th page.
    for(let i = 0; i < 6; ++i) {
      await act(async () => {
        nextPage.simulate('click');
      });
    }
    expect(dataStart).toBe(90);
    expect(dataEnd).toBe(100);

    // Click nextPage again, we shouldn't move anywhere
    await act(async () => {
      nextPage.simulate('click');
    });
    expect(dataStart).toBe(90);
    expect(dataEnd).toBe(100);

    await act(async () => {
      prevPage.simulate('click');
    });
    expect(dataStart).toBe(80);
    expect(dataEnd).toBe(90);
  });

  test('renders pagination navigator correctly', async () => {
    let dataStart, dataEnd;
    const onChange = (dataStart_, dataEnd_) => {
      dataStart = dataStart_;
      dataEnd = dataEnd_;
    };

    let node;
    await act(async () => {
      node = mount((
        <Paginator
          id="paginator-element"
          dataSize={100}
          pageSize={10}
          onChange={onChange}
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();

    expect(dataStart).toBe(0);
    expect(dataEnd).toBe(10);
  });
});
