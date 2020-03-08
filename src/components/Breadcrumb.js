import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = (props) => {

  const linkedItems = props.items.slice(0, -1);
  const lastItem = props.items[props.items.length - 1];

  return (
    <div className="breadcrumbTransparent" style={{ paddingLeft: "12px" }}>
      {linkedItems.map((item, i) => (
        <Link
          className="breadcrumb"
          to={item.to}
          key={i}
        >
          {item.text}
        </Link>
      ))}
      <span className="breadcrumb">{lastItem.text}</span>
    </div>
  );
};

export default Breadcrumb;
