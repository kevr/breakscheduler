import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const UserWidget = ({ userData, clearSession }) => (
  <div className="userWidget">
    {userData.isValid ? (
      <div className="sessionControl row">
        <span className="userEmail textSmall left">
          {/* Show an optional [admin] tag after the user email
              in the case where the user is an administrator. */}
          {`Logged in as ${userData.email}`}{userData.type === "admin" && " [admin]"}
        </span>
        <span className="widgets right">
          <Link to="/help/support/settings"
            className="settingsButton"
            alt="Settings"
          >
            {"Settings"}
          </Link>
          <a href="#"
            className="logoutButton"
            alt="Logout"
            onClick={(e) => {
              e.preventDefault();

              if(window.confirm("Are you sure you want to logout?")) {
                clearSession();
              }
            }}
          >
            {"Logout"}
          </a>
        </span>
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

const mapDispatch = (dispatch, ownProps) => ({
  clearSession: () => {
    localStorage.setItem("@authToken", null);
    dispatch({
      type: "CLEAR_SESSION"
    });
  }
});

export default connect(null, mapDispatch)(UserWidget);
