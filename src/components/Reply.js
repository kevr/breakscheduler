import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  patchRequest,
  deleteRequest
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
    const { reply } = this.props;
    deleteRequest(`tickets/${reply.ticket_id}/replies/${reply.id}`)
      .then((response) => {
        // If it succeeds, remove it from redux
        this.props.removeReply(reply);
      }).catch((error) => {
        // Otherwise, just set error state.
        console.error(error);
        this.setState({
          error: "Encountered a server error while deleting reply."
        });
      });
  }

  handleSave(e) {
    console.log("handleSave called");
    if(this.state.body === '') {
      this.setState({
        error: "A reply body is required."
      });
      return;
    }

    const { reply } = this.props;
    this.setState({ status: "loading" }, () => {
      patchRequest(`tickets/${reply.ticket_id}/replies/${reply.id}`, {
        body: this.state.body
      })
        .then((response) => {
          const reply = response.data;

          // Then, update our component state 'body' field to the new reply
          this.setState({
            body: reply.body,
            edit: false,
            error: null,
            status: "updated"
          }, () => {
            this.props.setReply(reply);
            console.log("handleSave end");
          });
        }).catch((error) => {
          // Otherwise, we got an API error.
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
      session,
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

    return (
      <div className="ticketReply">
        <div className="replyContent">
          {reply.user.id === session.id && (
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
              <p className="textMedium">{reply.body}</p>
              <div className="textSmall">{`by ${reply.user.email}`}</div>
            </div>
          )}

          {/* Conditionally expose an "error" div that displays
              any errors we set in this component's state. */}
          {this.state.error && (
            <div className="error textSmall">{this.state.error}</div>
          )}

          <div className="status">
            {renderStatus(this.state.status)}
          </div>
        </div>
      </div>
    );
  }
}

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

export default connect(null, mapDispatch)(Reply);
