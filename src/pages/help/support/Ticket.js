import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Loader,
  Reply,
  Breadcrumb,
  Badge,
  ReplyCollapse,
  TicketControl
} from '../../../components';

class Ticket extends Component {
  render() {
    console.log("Ticket.render");
    // If tickets are not yet resolved, display a loader.
    if(!this.props.tickets.resolved) {
      return <Loader />;
    } else {
      console.log(`Tickets: ${JSON.stringify(this.props.tickets.data)}`);
    }

    const id = this.props.match.params.id;
    const ticket = this.props.tickets.data.find(t => t.id.toString() === id);

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
            <TicketControl ticket={ticket} />
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
                  {`created by ${ticket.user.email}`}
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
                session={this.props.session}
                reply={reply}
              />
            ))}
          </div>

          <div>
            {/* If our ticket status is closed, we'll hide the widget */}
            {ticket.status !== "closed" && (
              <ReplyCollapse ticket={ticket} />
            )}
          </div>
        </div>
      </div>
    );
  }
};

const mapState = (state, ownProps) => ({
  session: state.session,
  tickets: state.tickets
});

export default connect(mapState, null)(Ticket);
