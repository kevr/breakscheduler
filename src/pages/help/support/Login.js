import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  getRequest,
  postRequest
} from '../../../actions/API';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleLogin(e) {
    e.preventDefault();
    let self = this;

    localStorage.setItem("@authToken", null);

    postRequest("users/login", this.state).then((response) => {
      // Did we get a token?
      console.log(response);
      const token = response.data.token;
      console.log(`Logged in successfully, got token: ${token}`);
      localStorage.setItem("@authToken", token);

      // Then, retrieve session data from server.
      getRequest("users/me").then((response) => {
        self.props.setSession(response.data);
        window.location.assign("/help/support");
      });
    });

    /* We should catch errors and test through this.
    .catch((error) => {
      console.error(error);
    });
    */
  }

  render() {

    if(this.props.userData.isValid) {
      return (
        <div className="subPage supportLogin">
          <p className="textCenter">
            {"You are logged in, redirecting to the "}
            <Link to="/help/support">Dashboard</Link> in three seconds...
          </p>
        </div>
      );
    }

    return (
      <div className="subPage supportLogin">
        <h4>Support Login</h4>

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

          <button
            id="submit-button"
            type="submit"
            className="btn primary"
          >
            {"Login"}
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
