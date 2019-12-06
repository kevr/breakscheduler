import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTickets } from '../actions/API';

class TicketBarrier extends Component {
  componentDidMount() {
    console.log("TicketBarrier.componentDidMount");
    const {
      tickets,
      setTickets
    } = this.props;
    if(!tickets.resolved) {
      getTickets().then(tickets => setTickets(tickets))
        .catch(error => {
          console.error(error);
          // Do nothing at this point.
        });
    }
  }

  /* We may want this for backup scenarios.
   * Let's mock it out in tests */
  /*
  componentDidUpdate() {
    console.log("TicketBarrier.componentDidUpdate");
    const {
      tickets,
      setTickets
    } = this.props;
    if(!tickets.resolved) {
      getTickets().then(tickets => setTickets(tickets))
        .catch(error => {
          console.error(error);
        });
    }
  }
  */

  render() {
    console.log("TicketBarrier.render");
    const {
      children
    } = this.props;

    return (
      <span className="ticketsProbe">
        {children}
      </span>
    );
  }
}

const mapState = (state, ownProps) => ({
  tickets: state.tickets
});

const mapDispatch = (dispatch, ownProps) => ({
  setTickets: (tickets) => dispatch({
    type: "SET_TICKETS",
    tickets: tickets
  })
});

export default connect(mapState, mapDispatch)(TicketBarrier);
