import React from 'react';
import { colorStyle } from './Style';
import config from '../config.json';

describe('colorStyle generator', () => {

  test('generates configured colors', () => {
    const style = colorStyle();
    expect(style.backgroundColor).toBe(config.color.background);
    expect(style.color).toBe(config.color.foreground);
  });

  test('generates configured colors and given object', () => {
    const style = colorStyle({
      margin: "0 auto"
    });
    expect(style.margin).toBe("0 auto");
    expect(style.backgroundColor).toBe(config.color.background);
    expect(style.color).toBe(config.color.foreground);
  });

});
