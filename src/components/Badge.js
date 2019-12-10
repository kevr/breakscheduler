import React from 'react';
import PropTypes from 'prop-types';

// Add different types of badge class conversions here.
const getBadgeClass = (text) => {
  const table = {
    "open": "green lighten-3 black-text",
    "escalated": "yellow lighten-3 black-text",
    "closed": "red lighten-2 white-text"
  };
  if(!table.hasOwnProperty(text))
    throw new Error(`Unsupported argument '${text}' for getBadgeClass`);
  return table[text];
};

// Add different types of badge raw text to display text conversions here.
const getBadgeText = (text) => {
  const table = {
    "open": "Open",
    "escalated": "Escalated",
    "closed": "Closed"
  };
  if(!table.hasOwnProperty(text))
    throw new Error(`Unsupported argument '${text}' for getBadgeText`);
  return table[text];
};

const Badge = (props) => {
  let className = `colorBadge ${getBadgeClass(props.value)}`;
  return (
    <span className={className} id={props.id}>
      {getBadgeText(props.value)}
    </span>
  );
};

Badge.getBadgeClass = getBadgeClass;
Badge.getBadgeText = getBadgeText;

Badge.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export {
  getBadgeText,
  getBadgeClass
};

export default Badge;
