import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import {
  getRequest
} from '../../../actions/API';
import {
  Badge,
  Loader,
  Breadcrumb
} from '../../../components';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.navigateTo = this.navigateTo.bind(this);
  }

  navigateTo(ticket) {
    this.props.history.push(`/help/support/ticket/${ticket.id}`);
  }

  render() {
    const { session, tickets } = this.props;

    const format = (date) => {
      return dateFormat(date, "dd/mm/yyyy, h:MM:ss TT Z");
    };

    return (
      <div className="subPage supportDash">
        <div className="row">
          <Breadcrumb items={[ { text: "Dashboard" } ]} />
        </div>
        <div className="Content">
          <div className="controlBox">
            <Link
              to="/help/support/createTicket"
               className="primary red lighten-2 btn"
            >
              {"Create A Ticket"}
            </Link>
          </div>

          <table className="tickets">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Updated</th>
                <th>Status</th>
              </tr>
            </thead>
              {tickets.resolved ? (
                <tbody>
                  {tickets.data.length > 0 ? tickets.data.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={e => {
                        this.navigateTo(ticket);
                      }}
                    >
                      <td>
                        <Link to={`/help/support/ticket/${ticket.id}`}>
                          {ticket.subject}
                        </Link>
                      </td>
                      <td>{format(new Date(ticket.updated_at))}</td>
                      <td>
                        <Badge
                          id={`ticket_${ticket.id}_badge`}
                          className={Badge.getBadgeClass(ticket.status)}
                        >
                          {Badge.getBadgeText(ticket.status)}
                        </Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td>No tickets to show...</td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td>
                      <Loader />
                    </td>
                  </tr>
                </tbody>
              )}
          </table>

        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  session: state.session,
  tickets: state.tickets
});

export default connect(mapState, null)(Dashboard);
