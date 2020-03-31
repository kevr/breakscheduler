import React from 'react';
import { appendIf } from '../lib/Util';

/**
 * A collection item.
**/
export const Item = ({ children, className }) => (
  <li className={appendIf("collection-item", className)}>
    {children}
  </li>
);

Item.defaultProps = {
  className: null
};

/**
 * A collection.
**/
const Collection = ({ children, className }) => (
  <ul className={appendIf("collection", className)}>
    {children}
  </ul>
);

Collection.defaultProps = {
  className: null
};

Collection.Item = Item;

export default Collection;
