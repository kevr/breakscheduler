import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import SearchComponent from './Search';

// Configure enzyme
configure({ adapter: new Adapter() });

describe('Search component', () => {
  
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

  test('renders without provided className', async () => {
    let node;
    await act(async () => {
      node = mount((
        <SearchComponent
          id="search-component"
          label="Search..."
          onChange={(t) => {}}
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();
    expect(node.find(".input-field").exists()).toBe(true);
  });

  test('renders with provided className', async () => {
    let node;
    await act(async () => {
      node = mount((
        <SearchComponent
          id="search-component"
          className="searchComponent"
          label="Search..."
          onChange={(t) => {}}
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();
    expect(node.find(".input-field").hasClass("searchComponent")).toBe(true);
  });

  test('calls onChange with parsed array of search terms', async () => {
    let searchTerms = null;
    const handleChange = (terms) => {
      searchTerms = terms;
    };

    let node;
    await act(async () => {
      node = mount((
        <SearchComponent
          id="search-component"
          className="searchComponent"
          label="Search..."
          onChange={handleChange}
        />
      ), {
        assignTo: document.getElementById("root")
      });
    });
    node.update();
    expect(searchTerms).toBeNull();

    expect(node.find(".input-field").hasClass("searchComponent")).toBe(true);

    const searchInput = node.find("#search-component").at(1);
    await act(async () => {
      searchInput.simulate('change', {
        target: {
          value: "term"
        }
      });
    });
    node.update();
    expect(searchTerms).toEqual(["term"]);

    await act(async () => {
      searchInput.simulate('change', {
        target: {
          value: '"Two Terms" parsed'
        }
      });
    });
    node.update();

    expect(searchTerms).toEqual(["Two Terms", "parsed"]);
  });
});
