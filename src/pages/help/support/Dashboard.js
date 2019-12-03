import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
  render() {
    const { userData, tickets } = this.props;
    return (
      <div className="subPage supportDash">
        <div className="Content">

          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Date Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.data.length > 0 ? tickets.data.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>
                    <Link to={`/help/support/ticket/${ticket.id}`}>
                      {ticket.subject}
                    </Link>
                  </td>
                  <td>{ticket.updated_at}</td>
                </tr>
              )) : (
                <tr>
                  <td>No tickets to show...</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="controlBox">
            <Link
              to="/help/support/createTicket"
              className="primary btn"
            >
              {"Create A Ticket"}
            </Link>
          </div>

        </div>
      </div>
    );
  }
}

export default Dashboard;
