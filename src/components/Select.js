import React, { Component } from 'react';
import M from 'materialize-css';

class Select extends Component {
  componentDidMount() {
    const elems = document.querySelectorAll("select");
    const options = {};
    M.FormSelect.init(elems, options);
  }

  componentDidUpdate() {
    const elems = document.querySelectorAll("select");
    const options = {};
    M.FormSelect.init(elems, options);
  }

  render() {
    return (
      <select
        id={this.props.id}
        value={this.props.value}
        onChange={this.props.onChange}
      >
        {this.props.children}
      </select>
    );
  }
}

export default Select;
