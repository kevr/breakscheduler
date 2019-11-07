import React, { Component } from 'react';
import M from 'materialize-css';

class Modal extends Component {
  componentDidMount() {
    var elems = document.querySelectorAll(".modal");
    M.Modal.init(elems, {});
  }

  render() {
    const { id, children } = this.props;
    return (
      <div id={`modal${id}`} className="modal">
        <div className="modal-content">
          {children}
        </div>
      </div>
    );
  }
}

export default Modal;

