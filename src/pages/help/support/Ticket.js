import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css';
import {
  postRequest
} from '../../../actions/API';
import Loader from '../../../components/Loader';
import Reply from '../../../components/Reply';

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null,
      replyBody: '',
      error: null
    };

    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    var elems = document.querySelector(".collapsible");
    var instance = M.Collapsible.init(elems, {});
    this.collapsible = instance;
  }

  handleBodyChange(e) {
    this.setState({ replyBody: e.target.value });
  }

  submitForm(e) {
    e.preventDefault();
    const { session, ticket } = this.props;

    // POST tickets/:ticket_id is used to create
    // a reply to the ticket. On the server-side,
    // the user is deduced by the POST request
    // header state and properly assigned.
    postRequest(`tickets/${ticket.id}/replies`, {
      body: this.state.replyBody
    }).then((response) => {
      // We expect a ticket to come back with the
      // new reply added.
      const reply = response.data;

      // Since we just updated our ticket, we can
      // clear out the reply form state we just submitted.
      this.setState({
        replyBody: ''
      }, () => {
        // Then, collapse our Reply form.
        this.collapsible.close();
        
        // Add the reply to our redux store; Redux re-renders
        // may cause this component to remount or unmount,
        // so we do this at the very end, after we've changed
        // the state of this component to be default again.
        this.props.addReply(reply);
      });

    }).catch((error) => {
      // 401?
      console.log(error);
      this.setState({
        error: "There was an error replying to this ticket."
      });
    });
  }

  render() {
    const { ticket } = this.props;
    console.log(`Rendering ${JSON.stringify(ticket)}`);

    if(!ticket)
      return <Loader />;

    const {
      id,
      user,
      subject,
      body,
      updated_at,
      replies
    } = ticket;

    return (
      <div className="ticketPage">
        <div className="ticket" id={`ticket${id}`}>
          <h5>{subject}</h5>
          <div className="textSmall">{`created by ${user.email}`}</div>
          <div className="textSmall">{`updated at ${updated_at}`}</div>
          <p className="textMedium">{body}</p>
        </div>

        <div className="ticketReplies">
          {replies.map((reply) => (
            <Reply
              key={reply.id}
              session={this.props.session}
              reply={reply}
            />
          ))}
        </div>

        <ul className="collapsible">
          <li>
            <div className="collapsible-header">
              <i className="material-icons">email</i>Reply
            </div>
            <div className="collapsible-body">

              {/* Ticket reply form */}
              <div className="replyForm">

                {/* We intercept the form submission, then send
                    state data to our API via axios. */}
                <form onSubmit={this.submitForm}>

                  {/* Body text area */}
                  <div className="input-field">
                    <textarea
                      className="materialize-textarea"
                      placeholder="Details of your reply..."
                      value={this.state.replyBody}
                      onChange={this.handleBodyChange}
                    />
                  </div>

                  {/* Send Reply button; Form submission */}
                  <div className="input-field textLeft">
                    <button type="submit"
                      className="primary btn"
                    >
                      {"Send Reply"}
                    </button>
                  </div>

                  {/* Error text that renders when there is
                      a non-null error to show. */}
                  {this.state.error && (
                    <div className="error">
                      {this.state.error}
                    </div>
                  )}

                </form>
              </div>

            </div>
          </li>
        </ul>

      </div>
    );
  }
};

const mapState = (state, ownProps) => ({
  session: state.session
});

const mapDispatch = (dispatch, ownProps) => ({
  // When we update a ticket, we need to also update it's
  // copy in redux -- with setTicket.
  // Currently unimplemented because we don't need it
  // and we don't want to test it. This should be used
  // when the Ticket component (page) is modifiable.
  /* setTicket: (id, ticket) => dispatch({
    type: "SET_TICKET",
    ticket: ticket
  }), */

  // Add a reply to this ticket.
  // Note: Replies need some sort of organized layout, accompanied
  // with a control box if the user viewing is the owner of the reply.
  //
  addReply: (reply) => dispatch({
    type: "ADD_REPLY",
    reply: reply
  }),

  // Reply management is done by the Reply component.
});

export default connect(mapState, mapDispatch)(Ticket);
