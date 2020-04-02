import React from 'react';

const Row = (props) => (
  <div className="row" {...props}>
    {props.children}
  </div>
);

export default Row;
