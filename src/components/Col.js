import React from 'react';
import PropTypes from 'prop-types';

const Col = (props) => {
  // If any of s, m, l, or xl props are provided to this component,
  // include their values in css classes for materialize.
  //
  // Example: s={6} -> "col s6"
  //
  let className = "col";
  if(props.s)
    className = className + ` s${props.s}`;
  if(props.m)
    className = className + ` m${props.m}`;
  if(props.l)
    className = className + ` l${props.l}`;
  if(props.xl)
    className = className + ` xl${props.xl}`;

  return (
    <div className={className} {...props}>
      {props.children}
    </div>
  );
};

Col.propTypes = {
  s: PropTypes.number,
  m: PropTypes.number,
  l: PropTypes.number,
  xl: PropTypes.number
};

export default Col;
