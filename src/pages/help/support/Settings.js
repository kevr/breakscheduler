//
// Support Settings page
// Allows a user to control their preferences, login details,
// or recover their accounts.
//
// NOTE: Something is fucked up in here.
//
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSession } from '../../../actions/API';
import { Breadcrumb } from '../../../components';
import {
  TextInput,
  PasswordInput,
  EmailInput
} from '../../../components/Input';
import {
  networkError,
  validationError
} from '../../../lib/MessageUtil';

class Settings extends Component {
  constructor(props) {
    super(props);

    // We initialize some of our fields with records
    // we got from the database. Of course, the passwords
    // are obscured and left empty.
    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',

      // An optional message to be displayed.
      messageClass: "error",
      message: null
    };

    // Some truthy functions. We need these to trigger
    // active state on these inputs.
    this.nameActive = this.nameActive.bind(this);
    this.emailActive = this.emailActive.bind(this);

    // Validation functions
    this.isModified = this.isModified.bind(this);
    this.confirmValid = this.confirmValid.bind(this);
    this.validate = this.validate.bind(this);
    this.validateInputs = this.validateInputs.bind(this);
    this.getModified = this.getModified.bind(this);

    // Submission function
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    let name = '';
    if(this.props.session.name !== undefined)
      name = this.props.session.name;
    let email = '';
    if(this.props.session.email !== undefined)
      email = this.props.session.email;
    this.setState({
      name: name,
      email: email
    });
  }

  isModified() {
    // Just make sure there's some matching password. Let the
    // server take care of deciding if it's good or not.
    const passwordValid = () => {
      return this.state.password.length > 0
        && this.state.password === this.state.password_confirmation;
    };

    // The page is modified if either name, email or passwords
    // are properly modified.
    return this.state.name !== this.props.session.name
      || this.state.email !== this.props.session.email
      || passwordValid();
  }

  confirmValid() {
    return this.state.password_confirmation === this.state.password;
  }

  validate() {
    // Don't worry about email in here, the HTML5 email input type
    // should take care of valid formatting.

    if(this.state.password.length > 0) {
      let good = this.state.password.length >= 6;
      if(!good) {
        return "Password must be at least six characters.";
      }
    }

    if(this.state.password !== this.state.password_confirmation) {
      return "Password and confirmation must match.";
    }

    return null;
  }

  validateInputs() {
    return this.state.password === this.state.password_confirmation
      && this.state.password.length > 0;
  }

  // This function simply constructs and returns an object
  // containing only modified inputs.
  getModified() {
    let object = {};
    if(this.state.password.length > 0) {
      object.password = this.state.password;
      object.password_confirmation = this.state.password_confirmation;
    }

    if(this.state.email !== this.props.session.email) {
      object.email = this.state.email;
    }

    if(this.state.name !== this.props.session.name) {
      object.name = this.state.name;
    }
    return object;
  }

  // This function should only ever be called when there is
  // modified data to send, so that need'nt be checked.
  handleSave(e) {
    e.preventDefault();

    console.debug("handleSave(e)");
    console.debug("Submitting");
    console.debug(this.getModified());

    let error = this.validate();
    if(error) {
      this.setMessage("error", validationError(error));
      return;
    }

    const data = this.getModified();
    updateSession(data)
      .then(session => {
        this.props.setMessage(
          "success", "Successfully updated your details!");
        this.props.setSession(session);
      })
      .catch(error => {
        console.error(error);
        this.props.setMessage("error", networkError());
      });
  }

  nameActive() {
    return this.state.name.length > 0;
  }

  emailActive() {
    return this.state.email.length > 0;
  }

  render() {
    console.log("Settings.render");
    const breadcrumb = [
      { to: "/help/support", text: "Dashboard" },
      { text: "User Settings" }
    ];

    return (
      <div className="subPage settingsPage">
        <div className="row">
          <Breadcrumb items={breadcrumb} />
        </div>

        <div className="changeName row">
          <TextInput
            active={this.nameActive()}
            className="col s4"
            id="name-input"
            label="Real Name"
            value={this.state.name}
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
          />
        </div>

        <div className="changeName row">
          <EmailInput
            active={this.emailActive()}
            className="col s4"
            id="email-input"
            label="email@example.org"
            value={this.state.email}
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
            invalidText={"Invalid email format"}
          />
        </div>

        <div className="changePassword row">
          <PasswordInput
            id="password-input"
            className="col s4"
            label="Change Password"
            value={this.state.password}
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
          />
          <PasswordInput
            id="confirm-input"
            className="col s4"
            label="Confirm"
            value={this.state.password_confirmation}
            valid={this.state.password === this.state.password_confirmation}
            invalidText={"Must match the password input"}
            onChange={e => {
              this.setState({ password_confirmation: e.target.value });
            }}
          />
        </div>

        <div className="row">
          <div className="col s12">
            <button
              className={`saveTrigger primary btn red lighten-2 ${this.isModified() ? "" : "disabled"}`}
              onClick={this.handleSave}
            >
              {"Save Changes"}
            </button>
          </div>
        </div>

        {/* This message will display error codes or successful
            notifications from our submit function. */}
        {this.props.message !== null && (
          <div className="row">
            <div className="message col s12">
              <span className={this.props.messageClass}>
                {this.props.message}
              </span>
            </div>
          </div>
        )}

      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  session: state.session,
  messageClass: state.message.messageClass,
  message: state.message.string
});

const mapDispatch = (dispatch, ownProps) => ({
  setSession: (session) => dispatch({
    type: "SET_SESSION",
    session: session
  }),
  setMessage: (messageClass, string) => dispatch({
    type: "SET_MESSAGE",
    messageClass: messageClass,
    string: string
  }),
  clearMessage: () => dispatch({
    type: "CLEAR_MESSAGE"
  })
});

export default connect(mapState, mapDispatch)(Settings);
