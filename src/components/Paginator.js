import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Col from './Col';
import Row from './Row';
import { colorStyle } from '../lib/Style';

class Paginator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
    this.changePage = this.changePage.bind(this);
  }

  // We may want to change how this component loads up...
  // Right now we're triggering a state change, but we
  // might be able to just do this another, less eventful way.
  componentDidMount() {
    this.changePage(1);
  }

  changePage(page) {
    this.setState({ page }, () => {
      this.props.onChange(
        // pageStart
        (page - 1) * this.props.pageSize,

        // pageEnd
        (page - 1) * this.props.pageSize + (this.props.pageSize)
      );
    });
  }

  render() {
    const {
      dataSize,
      pageSize
    } = this.props;
    const { page } = this.state;

    // Calculate the total number of pages.
    const pages = parseInt(dataSize / pageSize) + 1;

    const MAX_PAGES = 5;

    // Prepare an array of pages to display (maximum 5 at a time)
    // in the paginator navigation, located at the bottom.
    let pageArray = [];
    if(page < 3 || pages <= 5) {
      // If we have less than five pages, then just display up to 5.
      const end = pages <= MAX_PAGES ? pages : MAX_PAGES;
      for(let i = 1; i <= end; ++i)
        pageArray.push(i);
    } else if(page >= pages - 2) {
      // Otherwise, if we're on a page near the end of our pages,
      // just display the last five pages.
      for(let i = pages - 5; i < pages; ++i)
        pageArray.push(i);
    } else {
      // Otherwise, append {page - 2, page - 1, page, page + 1, page + 2}
      for(let i = page - 2; i <= page + 2; ++i)
        pageArray.push(i);
    }

    console.log(`
    Paginator.render

    page: ${this.state.page}
    dataSize: ${this.props.dataSize}
    pageSize: ${this.props.pageSize}

    pages: ${pages}
    pageArray: ${pageArray}

    `);



    return (
      <div className="paginator textCenter">

        <div className="pageContent">
          {this.props.children}
        </div>

        <Row
          style={{
            marginTop: "6px",
            marginBottom: "0"
          }}
        >
          <Col s={12}>
            <label>
              {`Displaying ${Math.min(pageSize, dataSize)} of ${dataSize} results on Page ${page}`}
            </label>
          </Col>
        </Row>

        <ul className="pagination">
          {/* Disabled if we're on the first page. */}
          <li className={page === 1 ? "disabled" : ""}>
            <a href="#!"
              onClick={e => {
                e.preventDefault();
                if(this.state.page > 1) {
                  this.changePage(this.state.page - 1);
                }
              }}
            >
              <i className="material-icons">
                chevron_left
              </i>
            </a>
          </li>

          {/* We need to count our pages here to display a
              link for each, up to a maximum of 10 at a time */}
          {pageArray.map((page) => (
            <li key={page}
              className={page === this.state.page ? "active" : ""}
              style={page === this.state.page ? colorStyle() : {}}
            >
              <a href="#!"
                onClick={e => {
                  e.preventDefault();
                  this.changePage(page);
                }}
              >
                {page}
              </a>
            </li>
          ))}

          {/* Disabled if we're on the last page. */}
          <li className={page === pages - 1 ? "disabled" : ""}>
            <a href="#!"
              onClick={e => {
                e.preventDefault();
                if(this.state.page < pages - 1) {
                  this.changePage(this.state.page + 1);
                }
              }}
            >
              <i className="material-icons">
                chevron_right
              </i>
            </a>
          </li>
        </ul>

      </div>
    );
  }
}

Paginator.propTypes = {
  // Required property dataSize should be the total
  // length of array data that we're paging through.
  dataSize: PropTypes.number.isRequired,

  // Required property pageSize should be the maximum
  // number of items per page.
  pageSize: PropTypes.number.isRequired,

  // onChange callback when the page is changed.
  // Provided with (dataStart, dataEnd)
  onChange: PropTypes.func.isRequired
};

export default Paginator;
