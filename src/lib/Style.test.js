import React from 'react';
import Style from './Style';
import config from '../config.json';

describe('Style generator', () => {

  test('generates configured colors', () => {
    const style = Style();
    expect(style.backgroundColor).toBe(config.color.background);
    expect(style.color).toBe(config.color.foreground);
  });

  test('generates configured colors and given object', () => {
    const style = Style({
      margin: "0 auto"
    });
    expect(style.margin).toBe("0 auto");
    expect(style.backgroundColor).toBe(config.color.background);
    expect(style.color).toBe(config.color.foreground);
  });

});
