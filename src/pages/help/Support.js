import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserWidget from '../../components/UserWidget';
import { SupportRouter } from './support';

class Support extends Component {
  componentDidUpdate(lastProps) {
    if(lastProps.session.resolved &&
      !lastProps.session.isValid &&
      this.props.session.isValid) {
      // If we just logged in, redirect to the Dashboard.
      this.props.history.push("/help/support");
    }
  }

  render() {
    const {
      session
    } = this.props;

    return (
      <div className="container">
        <div className="row">
          <UserWidget session={session} />
        </div>

        <div className="Content">
          <SupportRouter />
        </div>
      </div>
    )
  }
}

const mapState = (state, ownProps) => ({
  session: state.session,
  tickets: state.tickets
});

export default connect(mapState, null)(Support);
