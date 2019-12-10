import React, { Component } from 'react';
import M from 'materialize-css';
import ReplyForm from './ReplyForm';

class ReplyCollapse extends Component {
  constructor(props) {
    super(props);
    this.collapse = this.collapse.bind(this);
    this.instances = [];
  }

  componentDidMount() {
    const elems = document.querySelectorAll(".collapsible");
    const options = {};
    this.instances = M.Collapsible.init(elems, options);
    this.instance = this.instances[0];
  }

  componentWillUnmount() {
    this.instances.map(instance => {
      instance.destroy();
      return null;
    });
  }

  collapse() {
    this.instance.close();
  }

  render() {
    return (
      <ul className="collapsible addReply">
        <li>
          <div className="collapsible-header toggleButton">
            <i className="material-icons">email</i>{" Reply"}
          </div>
          <div className="collapsible-body">
            <ReplyForm
              ticket={this.props.ticket}
              collapse={this.collapse}
            />
          </div>
        </li>
      </ul>
    );
  }
}

export default ReplyCollapse;
