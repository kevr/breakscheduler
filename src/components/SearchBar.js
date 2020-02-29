import React, { Component } from 'react';
import PropTypes from 'prop-types';

// A component that provides a Search widget with
// callback actions when data is changed. This
// component abstracts away the parsing of Search
// criteria.
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Search input value
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const raw = e.target.value.split(/\s(?=(?:[^"]|"[^"]*")*$)/)
    const terms = raw.map((t) => {
      return t.replace(new RegExp('"', 'g'), '');
    });
    this.setState({ value: e.target.value }, () => {
      this.props.onChange(terms.filter(t => t.length > 0));
    });
  }

  render() {
    let className = "input-field";
    if(this.props.className)
      className = className.concat(` ${this.props.className}`);

    return (
      <div className={className}>
        <i className="material-icons prefix">search</i>
        <input
          id={this.props.id}
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <label htmlFor={this.props.id}>
          {this.props.label}
        </label>
      </div>
    );
  }
}

SearchBar.propTypes = {
  // ID to use for the input element
  id: PropTypes.string.isRequired,

  // Label used for the Search input
  label: PropTypes.string.isRequired,

  // On change function(searchTerms) callback
  onChange: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  className: null
};

export default SearchBar;
