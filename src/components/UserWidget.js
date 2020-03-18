import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const UserWidget = ({ session, clearSession }) => (
  <div className="userWidget">
    {session.isValid ? (
      <div className="sessionControl row">
        <span className="userEmail textSmall left">
          {/* Show an optional [admin] tag after the user email
              in the case where the user is an administrator. */}
          {`Logged in as ${session.email}`}{session.type === "admin" && " [admin]"}
        </span>
        {session.registered && (
          <span className="widgets right">
            <Link
              to="/help/support/settings"
              className="settingsButton primary red lighten-2 btn"
              alt="Settings"
            >
              {"Settings"}
            </Link>
            <button
              className="logoutButton primary red lighten-2 btn"
              alt="Logout"
              onClick={(e) => {
                e.preventDefault();
                if(window.confirm("Are you sure you want to logout?"))
                  clearSession();
              }}
            >
              {"Logout"}
            </button>
          </span>
        )}
      </div>
    ) : (
      <div className="sessionControl row">
        <span className="right">
          <Link className="loginButton" to="/help/support/login">
            {"Login"}
          </Link>
        </span>
      </div>
    )}
  </div>
);

const mapState = (state, ownProps) => ({
  session: state.session
});

const mapDispatch = (dispatch, ownProps) => ({
  clearSession: () => {
    localStorage.setItem("@authToken", null);
    dispatch({
      type: "CLEAR_SESSION"
    });
  }
});

export default connect(mapState, mapDispatch)(UserWidget);
