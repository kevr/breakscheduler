import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
import {
  Loader,
  Reply,
  Breadcrumb,
  StatusBadge,
  ReplyCollapse,
  Indicator,
  Row,
  Col,
  Container
} from '../../../components';
import {
  getTicket,
  updateTicket
} from '../../../actions/API';
import { colorStyle } from '../../../lib/Style';

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.onStatusChange = this.onStatusChange.bind(this);
    this.handleReply = this.handleReply.bind(this);

    this.reply_collapse = React.createRef();
    this.reply_form_link = React.createRef();
  }

  handleReply(reply) {
  }

  onStatusChange(status) {
    const params = qs.parse(this.props.location.search);
    const key = params.key;

    this.props.setStatusLoading();
    updateTicket(Object.assign({}, this.props.ticket.data, {
      status: status
    }), key)
      .then(ticket => {
        this.props.setTicket(ticket);
        this.props.setStatusSuccess();
      })
      .catch(error => {
        console.error(error);
        this.props.setStatusFailure();
        this.status_badge.forceUpdate();
      });
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

    // Always fetch a ticket when we mount this component.
    this.props.resetTicket();
    getTicket(id, key)
      .then(ticket => {
        this.props.setTicket(ticket);
      })
      .catch(error => {
        this.props.clearTicket();
      });
  }

  render() {
    console.log("Ticket.render");
    if(!this.props.ticket.resolved) {
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
          <Row>
            <Breadcrumb items={breadcrumb} />
          </Row>

          <Row>
            <p className="textCenter">
              {`The ticket you were looking for with id '${id}' could not be located.`}
            </p>
          </Row>
        </div>
      );
    }
    console.log(`Rendering ${JSON.stringify(ticket)}`);

    const email = this.props.session.email;

    // Breadcrumb items we'll use for <Breadcrumb> when rendering.
    let breadcrumb = [
      { text: `Ticket(${ticket.id})` }
    ];

    if(this.props.session.isValid) {
      breadcrumb = [
        { to: "/help/support", text: "Dashboard" },
        { text: `Ticket(${ticket.id})` }
      ];
    }

    const isAdmin = u => u.isValid && u.type === "admin";
    const isStaff = u => u.isValid && u.type === "staff";

    const options = ["open", "closed"];
    if(isAdmin(this.props.session) || isStaff(this.props.session)) {
      options.splice(1, 0, "escalated");
    }

    const isEditable = isAdmin(this.props.session) ||
      this.props.session.email === ticket.email;

    return (
      <div className="ticketPage">
        <Row>
          <Breadcrumb items={breadcrumb} />
        </Row>

        <Row>
          <Col s={12}>
            <div className="ticket card" id={`ticket_${ticket.id}`}>
              <div className="statusBox right">
                <label htmlFor="status-badge">
                  Status
                  <Indicator
                    id="status-indicator"
                    indicatorId="statusProgress"
                  />
                </label>
                <StatusBadge
                  id="status-badge"
                  status={ticket.status}
                  onChange={this.onStatusChange}
                  options={options}
                  editable={isEditable}
                  confirm={true}
                  ref={e => {
                    this.status_badge = e;
                  }}
                />
              </div>

              {/* Use s10 cols here to avoid cramming statusBox located
                  on the right of this card. */}
              <div className="card-content">
                <span className="card-title">
                  <Row>
                    <Col s={10}>
                      {ticket.subject}
                    </Col>
                  </Row>
                </span>
                <Row>
                  <Col s={10}>
                    <pre>{ticket.body}</pre>
                  </Col>
                </Row>
              </div>

              <div className="card-action">
                <span className="textSmall">
                  {`created by ${ticket.email}`}
                </span>
              </div>

            </div>

          </Col>
        </Row>

        <div className="ticketReplies">
          <span className="textSmall">Replies</span>
          <Container>
            {ticket.replies.map((reply) => (
              <Reply
                key={reply.id}
                reply={reply}
                authKey={key}
                isOwner={email === reply.email}
              />
            ))}
          </Container>

          <div>
            {/* If our ticket status is closed, we'll hide the widget */}
            {ticket.status !== "closed" && (
              <ReplyCollapse
                id="reply-form"
                ticket={ticket}
                authKey={key}
                onReply={this.handleReply}
                ref={this.reply_collapse}
              />
            )}
          </div>

          <div>
            {ticket.status !== "closed" && (
            <div className="actions">
              <span
                className="btn-floating btn-large waves-effect waves-light"
                style={colorStyle()}
                onClick={e => {
                  e.preventDefault();
                  // Collapse, then open to reset the scroll anchor state
                  this.reply_collapse.current.open();
                  this.reply_collapse.current.element().scrollIntoView({
                    behavior: "smooth"
                  });
                }}
                ref={this.reply_form_link}
              >
                <i className="material-icons">
                  add
                </i>
              </span>
            </div>
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
  setStatusLoading: () => {
    dispatch({
      type: "SET_ENABLED",
      id: "statusProgress"
    });
    dispatch({
      type: "SET_LOADING",
      id: "statusProgress"
    });
  },

  setStatusSuccess: () => {
    dispatch({
      type: "SET_SUCCESS",
      id: "statusProgress"
    });
  },

  setStatusFailure: () => {
    dispatch({
      type: "SET_FAILURE",
      id: "statusProgress"
    });
  },

  setTicket: (ticket) =>
    dispatch({
      type: "SET_TICKET",
      ticket: ticket
    }),
  clearTicket: () =>
    dispatch({
      type: "CLEAR_TICKET"
    }),
  resetTicket: () =>
    dispatch({
      type: "RESET_TICKET"
    }),
});

export default connect(mapState, mapDispatch)(Ticket);
