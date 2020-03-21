import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../Layout';
import {
  TextInput,
  EmailInput,
  Textarea,
  Button
} from '../../components/Input';
import Card from '../../components/Card';
import { validateEmail } from '../../lib/Validation';
import {
  addTicket
} from '../../actions/API';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      subject: '',
      body: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    addTicket(this.state)
      .then(response => {
        this.setState({
          email: '',
          subject: '',
          body: ''
        }, () => {
          this.props.setMessage("success", "Message successfully sent!");
        });
      })
      .catch(error => {
        this.props.setMessage(
          "error",
          "Server returned an error while processing submission."
        );
      });
  }

  isValid() {
    return this.state.email.length > 0
      && this.state.subject.length > 0
      && this.state.body.length > 0
      && validateEmail(this.state.email);
  }

  render() {
    return (
      <Layout pageTitle="Contact Us">

        <div className="flex flexColumn" />

        <div className="container">
          <div className="row">

            <div className="col s6">
              <p className="flowText textJustify">
                {"Test"}
              </p>
            </div>

            <div className="col s6">
              <Card title="Contact Form">
                <form
                  id="contact-form"
                  onSubmit={this.onSubmit}
                >
                  <div>
                    <EmailInput
                      id="email-input"
                      label="email@domain.tld"
                      value={this.state.email}
                      onChange={e => this.setState({ email: e.target.value })}
                      invalidText="Invalid email format"
                    />
                  </div>

                  <div>
                    <TextInput
                      id="subject-input"
                      label="Subject"
                      value={this.state.subject}
                      onChange={e => this.setState({ subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <Textarea
                      id="body-input"
                      className="input-field"
                      label="A detailed description of the message..."
                      value={this.state.body}
                      onChange={e => this.setState({ body: e.target.value })}
                    />
                  </div>

                  <div className="textCenter">
                    <Button
                      id="send-button"
                      disabled={!this.isValid()}
                    >
                      {"Send"}
                    </Button>
                  </div>

                </form>

                {/* This message will display error codes or successful
                    notifications from our submit function. */}
                {this.props.message !== null && (
                  <div className="row textCenter">
                    <div className="message col s12">
                      <span className={this.props.messageClass}>
                        {this.props.message}
                      </span>
                    </div>
                  </div>
                )}

              </Card>
            </div>
          </div>
        </div>

        <div className="flex flexColumn" />
      </Layout>
    );
  }
}

const mapState = (state, ownProps) => ({
  messageClass: state.message.messageClass,
  message: state.message.string
});

const mapDispatch = (dispatch, ownProps) => ({
  setMessage: (messageClass, string) => dispatch({
    type: "SET_MESSAGE",
    messageClass: messageClass,
    string: string
  })
});

export default connect(mapState, mapDispatch)(Contact);
