import React from 'react';
import PropTypes from 'prop-types';

// Add different types of badge class conversions here.
export const getBadgeClass = (text) => {
  const table = {
    "open": "green lighten-3 black-text",
    "escalated": "yellow lighten-3 black-text",
    "closed": "red lighten-2 white-text"
  };
  if(!table.hasOwnProperty(text))
    throw `Unsupported argument '${text}' for getBadgeClass`;
  return table[text];
};

// Add different types of badge raw text to display text conversions here.
export const getBadgeText = (text) => {
  const table = {
    "open": "Open",
    "escalated": "Escalated",
    "closed": "Closed"
  };
  if(!table.hasOwnProperty(text))
    throw `Unsupported argument '${text}' for getBadgeText`;
  return table[text];
};

const Badge = (props) => {
  let className = "colorBadge";
  if(props.className) {
    className = className.concat(` ${props.className}`);
  }
  return (
    <span className={className} id={props.id}>
      {props.children}
    </span>
  );
};

Badge.getBadgeClass = getBadgeClass;
Badge.getBadgeText = getBadgeText;

Badge.defaultProps = {
  className: ""
};

Badge.propTypes = {
  className: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default Badge;
