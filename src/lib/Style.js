import React from 'react';
import config from '../config.json';

/**
 * A Style generation function that returns an object with
 * our colors stored in config.json, as well as an optional
 * object we pass in.
**/
const Style = (opts = {}) => {
  return Object.assign({}, opts, {
    backgroundColor: config.color.background,
    color: config.color.foreground
  });
};

export default Style;
