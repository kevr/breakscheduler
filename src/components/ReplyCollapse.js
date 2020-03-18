import React, { Component } from 'react';
import M from 'materialize-css';
import ReplyForm from './ReplyForm';

class ReplyCollapse extends Component {
  constructor(props) {
    super(props);
    this.open = this.open.bind(this);

    this.element = this.element.bind(this);
    this.collapse = this.collapse.bind(this);
    this.onOpen = this.onOpen.bind(this);

    this.instances = [];
    this.reply_form = React.createRef();
  }

  componentDidMount() {
    const elems = document.querySelectorAll(".collapsible");
    const options = {
      onOpenEnd: this.onOpen
    };
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
    this.instances.map(instance => {
      instance.close();
      return null;
    });

    if(this.props.onReply) {
      this.props.onReply();
    }
  }

  // We ignore isOpen in coverage, because we pass it directly
  // to materializecss initialization and we know it's contents
  // work. It's tricky to get triggering without a real DOM though.
  /* istanbul ignore next */
  onOpen() {
    /* istanbul ignore next */
    this.reply_form.current.scrollIntoView({ behavior: "smooth" });
  }

  element() {
    return this.reply_form.current;
  }

  open() {
    this.instance.open();
  }

  render() {
    return (
      <ul className="collapsible addReply" ref={this.reply_form}>
        <li>
          <div className="collapsible-header toggleButton">
            <i className="material-icons">email</i>{" Reply"}
          </div>
          <div className="collapsible-body">
            <ReplyForm
              id={this.props.id}
              ticket={this.props.ticket}
              authKey={this.props.authKey}
              onReply={this.collapse}
            />
          </div>
        </li>
      </ul>
    );
  }
}

export default ReplyCollapse;
