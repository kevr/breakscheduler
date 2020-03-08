// 
// Modal component
// Renders a modal alongside it's trigger. This way,
// the Modal component is able to completely manage
// it's modal instance itself.
//
// Example usage:
//
// <Modal
//   id="modal-id"
//   trigger={(
//     <div className="card">
//       <div className="card-content">
//         <p>{"Click me!"}</p>
//       </div>
//     </div>
//   )}
// >
//   <h4>Modal Content</h4>
//   <p>...</p>
// </Modal>
//
// The .modal element will be accompanied by .open when
// it's open. Clicking outside of an open modal will trigger
// it to be closed.
//
import React, { Component } from 'react';
import M from 'materialize-css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: "modal"
    };
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    const options = {
      onOpenStart: () => {
        this.setState({ className: "modal open" });
      },
      onCloseStart: () => {
        this.setState({ className: "modal" });
      }
    };
    this.instance = M.Modal.init(this.modal, options);
  }

  componentWillUnmount() {
    this.instance.destroy();
  }

  close() {
    this.instance.close();
  }

  render() {
    const { id } = this.props;
    return (
      <span>
        {React.cloneElement(this.props.trigger, {
          onClick: (e) => {
            e.preventDefault();
            this.instance.open();
          }
        })}
        <div
          id={`modal${id}`}
          className={this.state.className}
          ref={modal => {
            this.modal = modal;
          }}
        >
          <div className="modal-content">
            {this.props.children}
          </div>
        </div>
      </span>
    );
  }
}

export default Modal;

