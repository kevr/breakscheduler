import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  postRequest
} from '../../../actions/API';
import Breadcrumb from '../../../components/Breadcrumb';
import { colorStyle } from '../../../lib/Style';

// A Ticket creation form for users.
//
// A child to Support, this page is located at
// /help/support/ticket/new
//
class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      body: '',
      error: null
    };

    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    postRequest("tickets", this.state).then((response) => {
      // Put this ticket into Redux
      const ticket = response.data;

      // Clear error state, then add the ticket to redux.
      // Afterward, redirect the user to the new ticket's page.
      this.setState({
        error: null
      }, () => {
        this.props.addTicket(ticket);

        // Redirect to the ticket we just created!
        this.props.history.push(`/help/support/tickets/${ticket.id}`);
      });
    }).catch((error) => {
      console.error(error);
      this.setState({
        error: "An error occurred while creating this ticket."
      });
    });
  }

  handleSubjectChange(e) {
    this.setState({ subject: e.target.value });
  }

  handleBodyChange(e) {
    this.setState({ body: e.target.value });
  }

  render() {
    const breadcrumb = [
      { to: "/help/support", text: "Dashboard" },
      { text: "Create Ticket" }
    ];

    return (
      <div className="subPage ticketCreate">
        <div className="row">
          <Breadcrumb items={breadcrumb} />
        </div>

        <form onSubmit={this.onSubmit}>

          <div className="input-field">
            <input type="text"
              id="subject-input"
              value={this.state.subject}
              onChange={this.handleSubjectChange}
            />
            <label htmlFor="subject-input">{"Subject"}</label>
          </div>

          <div className="input-field">
            <textarea
              id="body-input"
              className="materialize-textarea"
              value={this.state.body}
              onChange={this.handleBodyChange}
            />
            <label htmlFor="body-input">{"Detailed Description"}</label>
          </div>

          <div className="input-field">
            <button
              type="submit"
              className="primary btn"
              style={colorStyle()}
            >
              {"Create Ticket"}
            </button>
          </div>

        </form>

        <div className="textSmall">
          {this.state.error && (
            <span
              id="create-ticket-form-error"
              className="error"
            >
              {this.state.error}
            </span>
          )}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  session: state.session
});

const mapDispatch = (dispatch, ownProps) => ({
  addTicket: (ticket) => dispatch({
    type: "ADD_TICKET",
    ticket: ticket
  })
});

export default connect(mapState, mapDispatch)(Create);
