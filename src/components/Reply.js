import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateReply,
  deleteReply
} from '../actions/API';
import Loader from './Loader';

class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: this.props.reply.body,
      edit: false,
      error: null,
      status: null
    };

    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleBodyChange(e) {
    console.log("handleBodyChange called");
    this.setState({ body: e.target.value }, () => {
      console.log("handleBodyChange end");
    });
  }

  handleEdit(e) {
    console.log("handleEdit called");
    this.setState({ edit: true }, () => {
      console.log("handleEdit end");
    });
  }

  handleDelete(e) {
    console.log("handleDelete called");
    const msg = "Are you sure you want to permanently delete this reply?";
    if(!window.confirm(msg)) {
      // If the user doesn't confirm, we cancel everything
      // but returning out of this handler now.
      return;
    }

    // Otherwise, let's perform a delete request.
    const {
      reply,
      removeReply
    } = this.props;
    deleteReply(reply, this.props.authKey)
      .then(statusCode => {
        console.log(
          `Deleted Reply(${reply.id}) in Ticket(${reply.ticket_id})
          with status code: ${statusCode}`);
        removeReply(reply);
      }).catch(error => {
        console.error(error);
        console.warn(
          `Unable to delete Reply(${reply.id}) in Ticket(${reply.ticket_id})
          with status code: ${error.status}`);
        this.setState({
          error: "Encountered a server error while deleting reply."
        });
      });
  }

  handleSave(e) {
    console.log("handleSave called");
    if(this.state.body === '') {
      this.setState({
        error: "Reply body is required."
      });
      return;
    }

    const {
      reply,
      setReply
    } = this.props;

    const updatedReply = Object.assign({}, reply, {
      body: this.state.body
    });

    // First, set status state to loading, then
    // attempt to update the reply. If any error
    // is encountered, we'll set the error state
    // to some relevent text and log out warnings
    // and errors. Otherwise, we'll just set the
    // updated reply.
    this.setState({ status: "loading" }, () => {
      updateReply(updatedReply, this.props.authKey).then(reply => {
          setReply(reply);
          this.setState({
            body: reply.body,
            edit: false,
            error: null,
            status: "updated"
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            error: "Encountered a server error while saving reply edits."
          });
        });
    });
  }

  handleCancel(e) {
    this.setState({ edit: false, error: null });
  }

  render() {
    const {
      reply
    } = this.props;

    // Prepare status component here.
    const renderStatus = (s) => {
      switch(s) {
        case "updated":
          return <i className="material-icons">updated</i>;
        case "loading":
          return <Loader />;
        default:
          return '';
      }
    };

    const dateUpdated = new Date(reply.updated_at);

    return (
      <div className="ticketReply card">
        <div className="replyContent card-content">
          {this.props.isOwner && (
            <div className="controlBox right">
              {!this.state.edit && (
                <div className="right">
                  {/* Edit button */}
                  <button className="editButton" onClick={this.handleEdit}>
                    <i className="material-icons">edit</i>
                  </button>

                  {/* Delete */}
                  <button className="deleteButton" onClick={this.handleDelete}>
                    <i className="material-icons">delete</i>
                  </button>
                </div>
              )}
            </div>
          )}

          {this.state.edit ? (
            <div className="replyEditor">
              <div className="input-field">
                <div className="right">
                  {/* Update */}
                  <button
                    className="saveButton"
                    onClick={this.handleSave}
                  >
                    <i className="material-icons">save</i>
                  </button>

                  {/* Cancel edit */}
                  <button
                    className="cancelButton"
                    onClick={this.handleCancel}
                  >
                    <i className="material-icons">close</i>
                  </button>
                </div>

                <textarea
                  id="reply-textarea"
                  className="materialize-textarea"
                  value={this.state.body}
                  onChange={this.handleBodyChange}
                />
                <label htmlFor="reply-textarea">
                  {"Edit Reply"}
                </label>
              </div>
            </div>
          ) : (
            <div className="replyInfo">
              <p>{reply.body}</p>
            </div>
          )}

          {/* Conditionally expose an "error" div that displays
              any errors we set in this component's state. */}
          <div className="textSmall">
            {this.state.error && (
              <span
                id="reply-edit-error"
                className="error"
              >
                {this.state.error}
              </span>
            )}
          </div>

          <div className="status">
            {renderStatus(this.state.status)}
          </div>
        </div>

        <div className="card-action">
          <span className="textSmall">
            {`updated ${dateUpdated.toString()} by ${reply.email}`}
          </span>
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  session: state.session
});

const mapDispatch = (dispatch, ownProps) => ({
  setReply: (reply) => dispatch({
    type: "SET_REPLY",
    reply: reply
  }),
  removeReply: (reply) => dispatch({
    type: "REMOVE_REPLY",
    reply: reply
  })
});

export default connect(mapState, mapDispatch)(Reply);
