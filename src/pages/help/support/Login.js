import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getRequest,
  postRequest,
  userLogin,
  getSession
} from '../../../actions/API';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isAdmin: false,
      rememberForm: false,
      error: null
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleIsAdminChange = this.handleIsAdminChange.bind(this);
    this.handleRememberChange = this.handleRememberChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  
  componentDidMount() {
    // When this component mounts, we'll try to apply
    // any rememberedLogin data stored by a previous login.
    const rememberedLogin = localStorage.getItem("@rememberedLogin", "null");
    if(rememberedLogin !== null && rememberedLogin !== "null") {
      // Base64-decode our rememberedLogin data, then parse
      // it into a javascript object.
      const details = JSON.parse(rememberedLogin);
      console.log(`Remembered details: ${rememberedLogin}`);
      const endpoint = details.isAdmin
        ? "users/admin/login"
        : "users/login";

      console.log(`POST ${endpoint}`);
      // Login
      userLogin(details).then(data => {
        const token = data.token;
        this.props.setToken(token);
      }).catch((error) => {
        // If we got an error, which is probably a 401, forget
        // the rememberedLogin data.
        localStorage.setItem("@rememberedLogin", null);
        this.props.clearToken();
      });
    }
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  // We should have some extra logic in this function that checks
  // our input validation before attempting to login.
  handleLogin(e) {
    e.preventDefault();
    localStorage.setItem("@authToken", null);

    // If the administrator box is checked, we login via
    // users/admin/login. Otherwise, we login as a normal
    // user via users/login.
    const endpoint = this.state.isAdmin
      ? "users/admin/login"
      : "users/login";

    userLogin(this.state).then(data => {
      // Did we get a token?
      console.log(data);
      const token = data.token;
      console.log(`Logged in successfully, got token: ${token}`);

      // If we successfully logged in, save our login details
      // if rememberForm was true.
      const { rememberForm } = this.state;
      if(rememberForm) {
        // If we store remembered data, we Base64-encode the
        // JSON-encoded version of this.state.
        localStorage.setItem("@rememberedLogin",
          JSON.stringify(this.state));
      } else {
        localStorage.setItem("@rememberedLogin", null);
      }

      localStorage.setItem("@authToken", token);
      getSession().then(user => this.props.setSession(user))
        .catch(error => {
          this.props.clearSession();
        });

    }).catch((error) => {
      console.error(
        "Unable to login due to http error originating from " +
        `${endpoint}`);

      this.setState({
        error: "Unable to login."
      }, () => {
        // Erase rememberedLogin if it exists.
        localStorage.setItem("@rememberedLogin", null);
      });
    });
  }

  handleIsAdminChange(e) {
    this.setState({ isAdmin: e.target.checked });
  }

  handleRememberChange(e) {
    this.setState({ rememberForm: e.target.checked });
  }

  render() {
    return (
      <div className="subPage supportLogin">
        <p className="textSmall textCenter">
          {"A user is required in order to access the Support section."}<br />
          {"You can login below."}
        </p>
        <form onSubmit={this.handleLogin}>
          <div className="input-field">
            <input
              id="email-input"
              type="email"
              value={this.state.email}
              onChange={e => this.handleEmailChange(e)}
            />
            <label htmlFor="password-input">Email</label>
          </div>

          <div className="input-field">
            <input
              id="password-input"
              type="password"
              value={this.state.password}
              onChange={e => this.handlePasswordChange(e)}
            />
            <label htmlFor="password-input">Password</label>
          </div>

          <p className="left" style={{
            marginRight: "12px"
          }}>
            <label>
              <input
                id="is-admin-input"
                className="filled-in"
                type="checkbox"
                checked={this.state.isAdmin}
                onChange={this.handleIsAdminChange}
              />
              <span>I am an Administrator</span>
            </label>
          </p>

          <p className="left">
            <label>
              <input
                id="remember-input"
                className="filled-in"
                type="checkbox"
                checked={this.state.rememberForm}
                onChange={this.handleRememberChange}
              />
              <span>Remember me</span>
            </label>
          </p>

          <div className="input-field right">
            <button
              id="submit-button"
              type="submit"
              className="btn primary red lighten-2"
            >
              {"Login"}
            </button>
          </div>

        </form>

        <div style={{ clear: "both" }} />
        <div className="textSmall textCenter">
          {this.state.error !== null && (
            <span
              id="login-form-error"
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
  setSession: (session) => dispatch({
    type: "SET_SESSION",
    session: session
  }),
  clearSession: (session) => dispatch({
    type: "CLEAR_SESSION"
  }),

  // Token dispatchers
  setToken: (token) => {
    localStorage.setItem("@authToken", token);
    dispatch({
      type: "SET_TOKEN",
      token: token
    });
  },
  clearToken: () => {
    localStorage.setItem("@authToken", null);
    dispatch({
      type: "CLEAR_TOKEN"
    });
  }
});

export default connect(mapState, mapDispatch)(Login);
