import React from 'react';
import PropTypes from 'prop-types';

const Card = (props) => (
  <div className={`card ${props.className}`}>
    <div className="card-content">
      {props.title !== undefined && (
        <span className="card-title textCenter">{props.title}</span>
      )}
      <div>
        {props.children}
      </div>
    </div>
  </div>
);

Card.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string
};

Card.defaultProps = {
  className: ""
};

export default Card;
