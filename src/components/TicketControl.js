import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateTicket
} from '../actions/API';
import Select from './Select';

class TicketControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.ticket.status,
      error: null
    };

    this.resetState = this.resetState.bind(this);
    this.isModified = this.isModified.bind(this);

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  resetState() {
    this.setState({
      status: this.props.ticket.status,
      error: null
    });
  }

  // Handle this.state.status change
  handleStatusChange(e) {
    e.preventDefault();
    this.setState({ status: e.target.value });
  }

  handleSave(e) {
    e.preventDefault();

    // Fill up postData if we have modified content.
    let postData = {
      id: this.props.ticket.id
    };

    // We'll have to update this to be strict when we add
    // more configurables in ticketControl. For now, we only
    // have the status option, which makes this a forced path
    // because the Save Button only appears when the status is
    // modified.
    // 
    // For now, excluding the next if line from coverage.
    //
    // istanbul ignore next
    if(this.state.status !== this.props.ticket.status)
      postData.status = this.state.status;

    updateTicket(postData)
      .then(ticket => {
        this.setState({
          status: postData.status
        }, () => {
          this.props.setTicket(ticket);
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          error: "Unable to update ticket through API."
        });
      });
  }

  isModified() {
    return this.state.status !== this.props.ticket.status;
  }

  render() {
    const statusOptions = [
      "open",
      "escalated",
      "closed"
    ];
    
    return (
      <div className="row">
        <div className="col s12">
          <div className="ticketControl card">
            <div className="card-content">
              <div className="input-field" style={{ width: "100px" }}>
                <Select
                  id="status-select"
                  value={this.state.status}
                  onChange={this.handleStatusChange}
                >
                  {statusOptions.map((opt, i) => ( 
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
                <label htmlFor="status-select">{"Status"}</label>
              </div>

              {this.state.error && (
                <div id="ticket-control-error" className="error">
                  {this.state.error}
                </div>
              )}

              {this.isModified() && (
                <button
                  className="primary btn red lighten-2"
                  onClick={this.handleSave}
                >
                  {"Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  setTicket: (ticket) => dispatch({
    type: "SET_TICKET",
    ticket: ticket
  })
});

export default connect(null, mapDispatch, null, { forwardRef: true })(TicketControl);
