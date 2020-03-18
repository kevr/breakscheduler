import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import {
  Badge,
  Loader,
  Breadcrumb,
  Paginator
} from '../../../components';
import SearchBar from '../../../components/SearchBar';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketStart: 0,
      ticketEnd: 0,
      searchTerms: []
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.navigateTo = this.navigateTo.bind(this);
  }

  navigateTo(ticket) {
    this.props.history.push(`/help/support/tickets/${ticket.id}`);
  }

  handlePageChange(dataStart, dataEnd) {
    this.setState({
      ticketStart: dataStart,
      ticketEnd: dataEnd
    });
  }

  handleSearch(terms) {
    this.setState({ searchTerms: terms });
  }

  render() {
    const { tickets } = this.props;

    const formatDate = (date) => {
      return dateFormat(date, "dd/mm/yyyy");
    };
    const formatTime = (date) => {
      return dateFormat(date, "h:MM:ss TT Z");
    };

    // Enum conversion table for sorting.
    const conv = {
      "open": 0,
      "escalated": 1,
      "closed": 2
    };

    // We need to filter tickets by search criteria, if any is given.
    let sortedTickets = tickets.data;
    if(this.state.searchTerms.length > 0) {
      this.state.searchTerms.map(searchTerm => {
        sortedTickets = sortedTickets.filter(ticket => {
          return ticket.subject.toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
        // We only map these items to filter out sorted tickets.
        // Return null here to get rid of a warning.
        return null;
      });
    }

    console.log(`searchTerms: ${this.state.searchTerms}`);

    sortedTickets.sort((a, b) => {
      if(conv[a.status] < conv[b.status])
        return -1;
      if(conv[a.status] > conv[b.status])
        return 1;
      return 0;
    });

    const ticketResults = sortedTickets
      .slice(this.state.ticketStart, this.state.ticketEnd)
      .map(ticket => {
        return (
          <tr key={ticket.id}
            onClick={e => {
              this.navigateTo(ticket);
            }}
          >
            <td>
              <Link to={`/help/support/tickets/${ticket.id}`}>
                {ticket.subject}
              </Link>
            </td>
            <td>
              <div className="textSmall">
                {formatDate(new Date(ticket.updated_at))} - {formatTime(new Date(ticket.updated_at))}
              </div>
            </td>
            <td>
              <Badge
                id={`ticket_${ticket.id}_badge`}
                value={ticket.status}
              />
            </td>
          </tr>
        );
      });

    return (
      <div className="subPage supportDash">
        <div className="row">
          <Breadcrumb items={[ { text: "Dashboard" } ]} />
        </div>
        <div style={{ height: "10px" }} />
        <div className="Content">
          <div>
            <Link
              to="/help/support/createTicket"
               className="primary red lighten-2 btn"
            >
              {"Create A Ticket"}
            </Link>
          </div>

          <SearchBar
            id="ticket-search-input"
            className="ticketSearch"
            label="Search tickets..."
            onChange={this.handleSearch}
          />

          <Paginator
            dataSize={sortedTickets.length}
            pageSize={10}
            onChange={this.handlePageChange}
          >
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
                    {tickets.data.length > 0 ? ticketResults : (
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
          </Paginator>

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
