import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getBadgeClass, getBadgeText, SelectBadge, Badge } from './Badge';

class StatusBadge extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ status: e.target.value }, () => {
      this.props.onChange(this.state.status);
    });
  }

  render() {
    if(!this.props.editable)
      return <Badge id={this.props.id} value={this.props.status} />;

    // Otherwise, it's editable
    return (
      <SelectBadge
        id={this.props.id}
        value={this.props.status}
        onChange={this.onChange}
      >
          {this.props.options.map((option, i) => (
            <option key={i} className={getBadgeClass(option)} value={option}>
              {getBadgeText(option)}
            </option>
          ))}
      </SelectBadge>
    );
  }
}

StatusBadge.propTypes = {
  id: PropTypes.string.isRequired,

  // Example: (status) => { console.log(status); }
  onChange: PropTypes.func.isRequired,

  // Example: [ "open", "closed" ]
  options: PropTypes.array.isRequired,

  // true if the status badge should be editable
  editable: PropTypes.bool.isRequired
};

StatusBadge.defaultProps = {
  // Do not require these props; they should only be provided
  // in the case that editable is true.
  options: [],
  editable: false,
};

export default StatusBadge;
