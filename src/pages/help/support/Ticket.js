import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
import {
  Loader,
  Reply,
  Breadcrumb,
  Badge,
  ReplyCollapse,
  TicketControl
} from '../../../components';
import {
  getTicket
} from '../../../actions/API';

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.handleReply = this.handleReply.bind(this);
  }

  handleReply() {
    if(this.ticketControl) {
      console.log("handleReply called resetState on TicketControl");
      this.ticketControl.resetState();
    }
  }

  // In order to properly load a Ticket, we first need to perform
  // an ajax request to API for the ticket in question.
  //
  // After, we need to either setTicket or clearTicket, then
  // falsify the loading state of this component. This order
  // must be held true to avoid data races.
  //
  componentDidMount() {
    const id = this.props.match.params.id;
    const params = qs.parse(this.props.location.search);
    const key = params.key;

    getTicket(id, key)
      .then(ticket => {
        this.props.setTicket(ticket);
        this.setState({ loading: false });
      })
      .catch(error => {
        this.props.clearTicket();
        this.setState({ loading: false });
      });
  }

  render() {
    console.log("Ticket.render");
    if(this.state.loading) {
      return <Loader />;
    }

    const ticket = this.props.ticket.data;

    // Optional authentication key
    const params = qs.parse(this.props.location.search);
    const key = params.key;

    console.log("Ticket.key = " + key);

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

    let email;
    // Set *our* email depending on our auth state
    if(!this.props.session.isValid) {
      email = ticket.email;
    } else {
      email = this.props.session.email;
    }

    // Breadcrumb items we'll use for <Breadcrumb> when rendering.
    const breadcrumb = [
      { to: "/help/support", text: "Dashboard" },
      { text: `Ticket(${ticket.id})` }
    ];

    // const dateUpdated = new Date(ticket.updated_at);

    const isAdmin = u => u.isValid && u.type === "admin";

    return (
      <div className="ticketPage">
        <div className="row">
          <Breadcrumb items={breadcrumb} />
        </div>

        {/* If the viewer is an Administrator, display our TicketControl */}
        {isAdmin(this.props.session) && (
          <div className="row">
            <TicketControl
              ref={(c) => {
                this.ticketControl = c;
              }}
              ticket={ticket}
              authKey={key}
            />
          </div>
        )}

        <div className="row">
          <div className="col s12">
            <div className="ticket card" id={`ticket_${ticket.id}`}>
              <div className="statusBox right">
                <label htmlFor="status-badge">Status</label>
                <Badge
                  id="status-badge"
                  value={ticket.status}
                />
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
                <span className="textSmall">
                  {`created by ${ticket.email}`}
                </span>
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
                reply={reply}
                authKey={key}
                isOwner={email === reply.email}
              />
            ))}
          </div>

          <div>
            {/* If our ticket status is closed, we'll hide the widget */}
            {ticket.status !== "closed" && (
              <ReplyCollapse
                ticket={ticket}
                authKey={key}
                onReply={this.handleReply}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
};

const mapState = (state, ownProps) => ({
  session: state.session,
  ticket: state.ticket
});

const mapDispatch = (dispatch, ownProps) => ({
  setTicket: (ticket) =>
    dispatch({
      type: "SET_TICKET",
      ticket: ticket
    }),
  clearTicket: () =>
    dispatch({
      type: "CLEAR_TICKET"
    })
});

export default connect(mapState, mapDispatch)(Ticket);
