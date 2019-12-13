import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import M from 'materialize-css';
import {
  updateTicket,
  addReply
} from '../actions/API';

class ReplyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',

      buttonText: "Send Reply",

      // Error-state text, if any.
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const elems = document.querySelectorAll(".dropdown-trigger");
    const options = {
      constrainWidth: false
    };
    this.instances = M.Dropdown.init(elems, options);
    this.instance = this.instances[0];
  }

  componentWillUnmount() {
    this.instances.map(instance => {
      instance.destroy();
      return null;
    });
  }

  handleSubmit(e) {
    console.log("ReplyForm.handleSubmit");
    e.preventDefault();

    if(this.state.body === '') {
      this.setState({
        error: "Reply body is required."
      });
      return;
    }

    const { ticket } = this.props;
    const replyData = {
      body: this.state.body,
      ticket_id: ticket.id
    };

    const shouldClose = (text) => {
      return text === "Send Reply and Close";
    };

    // There is some kind of Redux/Promise race here. Perhaps
    // we should be able to await for certain Promises to finish...
    addReply(replyData).then(reply => {
      this.setState({ error: null, body: '' }, () => {

        // Add our new reply to the Ticket in Redux
        this.props.addReply(reply);

        // If the user clicked the "Send Reply and Close" button
        if(shouldClose(this.state.buttonText)) {
          // Then, update the Ticket in question with a status of "closed"
          // on the server.
          const updatedTicket = Object.assign({}, this.props.ticket, {
            status: "closed"
          });

          updateTicket(updatedTicket)
            .then(ticket => {
              // If we're given a valid response, then update Redux's
              // copy of the Ticket being updated.
              console.log(ticket);
              this.props.setTicket(ticket);
              this.props.onReply();
            })
            .catch(error => {
              console.error(error);
              this.setState({
                error: "Encountered a server error while updating ticket state."
              });
            });
        } else {
          this.props.onReply();
        }

      });
    }).catch(error => {
      console.error(error);
      this.setState({
        error: "Unable to add reply. See the browser inspector for details."
      });
    });
  }

  render() {

    const dropdownOptions = [
      "Send Reply",
      "Send Reply and Close"
    ];

    return (
      <form id="reply-form" onSubmit={this.handleSubmit}>
        <div className="input-field">
          <textarea
            id="reply-body-input"
            className="materialize-textarea"
            value={this.state.body}
            onChange={e => this.setState({ body: e.target.value })}
          ></textarea>
          <label htmlFor="reply-body-input">
            {"Reply Body"}
          </label>
        </div>

        <div className="input-field">
          <button
            id="reply-submit-button"
            type="submit"
            className="primary btn red lighten-2"
          >
            {this.state.buttonText}
          </button>

          <div className="horizontalGap" />

          <a href="#!"
            className="dropdown-trigger btn red lighten-2"
            data-target="reply-dropdown"
          >
            <i className="material-icons">
              keyboard_arrow_down
            </i>
          </a>
        </div>

        <div className="textSmall">
          {this.state.error && (
            <span id="reply-form-error" className="error">
              {this.state.error}
            </span>
          )}
        </div>

        <ul
          id="reply-dropdown"
          className="dropdown-content red lighten-2 white-text"
        >
          {dropdownOptions.map((item, i) => (
            <li
              key={i}
              hidden={item === this.state.buttonText}
              onClick={e => {
                this.setState({ buttonText: item }, () => {
                  // We mock the event we pass to this.handleSubmit here,
                  // because it's not actually a form submission.
                  this.handleSubmit({
                    preventDefault: () => {}
                  });
                });
              }}
            >
              <a href="#!" onClick={e => e.preventDefault()}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </form>
    );
  }
}

ReplyForm.propTypes = {
  ticket: PropTypes.object.isRequired,
  onReply: PropTypes.func
};

const mapDispatch = (dispatch, ownProps) => ({
  addReply: (reply) =>dispatch({
    type: "ADD_REPLY",
    reply: reply
  }),
  setTicket: (ticket) => dispatch({
    type: "SET_TICKET",
    ticket: ticket
  })
});

export default connect(null, mapDispatch)(ReplyForm);
