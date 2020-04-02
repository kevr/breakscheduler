import React from 'react';
import PropTypes from 'prop-types';

const Col = ({ children, s }) => (
  <div className={`col s${s}`}>
    {children}
  </div>
);

Col.propTypes = {
  s: PropTypes.number.isRequired
};

export default Col;
