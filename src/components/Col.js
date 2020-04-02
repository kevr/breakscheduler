import React from 'react';
import PropTypes from 'prop-types';

const Col = (props) => (
  <div className={`col s${props.s}`} {...props}>
    {props.children}
  </div>
);

Col.propTypes = {
  s: PropTypes.number.isRequired
};

export default Col;
