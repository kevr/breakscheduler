import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import M from 'materialize-css';
import {
  postRequest
} from '../../../actions/API';
import {
  Loader,
  Reply,
  Breadcrumb,
  Badge
} from '../../../components';

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: null,
      replyBody: '',
      error: null
    };

    this.bindInstances = this.bindInstances.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.addReply = this.addReply.bind(this);
  }

  bindInstances() {
    let elems = document.querySelectorAll(".collapsible");
    let instances = M.Collapsible.init(elems, {});
    this.collapsibles = instances;
    this.collapsible = instances[0];
  }

  // We need to setup .collapsible whenever we can.
  componentDidMount() {
    console.log("Ticket.componentDidMount");
    this.bindInstances();
  }

  componentDidUpdate() {
    console.log("Ticket.componentDidUpdate");
    this.collapsibles.map(c => c.destroy());
    this.bindInstances();
  }

  componentWillUnmount() {
    this.collapsibles.map(c => c.destroy());
  }

  handleBodyChange(e) {
    this.setState({ replyBody: e.target.value });
  }

  addReply(e) {
    e.preventDefault();

    const id = this.props.match.params.id;

    // POST tickets/:ticket_id is used to create
    // a reply to the ticket. On the server-side,
    // the user is deduced by the POST request
    // header state and properly assigned.
    postRequest(`tickets/${id}/replies`, {
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
    console.log("Ticket.render");
    // If tickets are not yet resolved, display a loader.
    if(!this.props.tickets.resolved) {
      return <Loader />;
    } else {
      console.log(`Tickets: ${JSON.stringify(this.props.tickets.data)}`);
    }

    const id = this.props.match.params.id;
    const ticket = this.props.tickets.data.find(t => t.id.toString() == id);

    if(!ticket) {
      console.error("Rendering ticket page for ticket that does not exist");
      const breadcrumb = [
        { to: "/help/support", text: "Dashboard" },
        { text: "Not Found" }
      ];
      
      const id = this.props.match.params.id;
      return (
        <div className="ticketPage">
          <div className="row">
            <Breadcrumb items={breadcrumb} />
          </div>

          <div className="row">
            <p className="textCenter">
              {`The ticket you were looking for with id '${id}' could not be located.`}
            </p>
          </div>
        </div>
      );
    }
    console.log(`Rendering ${JSON.stringify(ticket)}`);

    // Breadcrumb items we'll use for <Breadcrumb> when rendering.
    const breadcrumb = [
      { to: "/help/support", text: "Dashboard" },
      { text: `Ticket(${ticket.id})` }
    ];

    const dateUpdated = new Date(ticket.updated_at);
    return (
      <div className="ticketPage">
        <div className="row">
          <Breadcrumb items={breadcrumb} />
        </div>

        <div className="row">
          <div className="col s12">
            <div className="ticket card" id={`ticket_${ticket.id}`}>
              <div className="statusBox right">
                <label htmlFor="status-badge">Status</label>
                <Badge
                  id="status-badge"
                  className={Badge.getBadgeClass(ticket.status)}
                >
                  {Badge.getBadgeText(ticket.status)}
                </Badge>
              </div>

              {/* Use s10 cols here to avoid cramming statusBox located
                  on the right of this card. */}
              <div className="card-content">
                <span className="card-title">
                  <div className="row">
                    <div className="col s10">
                      {ticket.subject}
                    </div>
                  </div>
                </span>
                <div className="row">
                  <div className="col s10">
                    <p>{ticket.body}</p>
                  </div>
                </div>
              </div>

              <div className="card-action">
                <span className="textSmall">{`created by ${ticket.user.email}`}</span>
              </div>

            </div>

          </div>
        </div>

        <div className="ticketReplies">
          <span className="textSmall">Replies</span>
          <div className="container">
            {ticket.replies.map((reply) => (
              <Reply
                key={reply.id}
                session={this.props.session}
                reply={reply}
              />
            ))}
          </div>

          <ul className="collapsible addReply">
            <li>
              <div className="collapsible-header toggleButton">
                <i className="material-icons">email</i>Reply
              </div>
              <div className="collapsible-body">

                {/* Ticket reply form */}
                <div className="replyForm">

                  {/* We intercept the form submission, then send
                      state data to our API via axios. */}
                  <form onSubmit={this.addReply}>

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
                        className="primary red lighten-2 btn"
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
      </div>
    );
  }
};

const mapState = (state, ownProps) => ({
  session: state.session,
  tickets: state.tickets
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
