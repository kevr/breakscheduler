import React from 'react';
import {
  appendIf
} from './Util';

describe('Util library', () => {

  test('appendIf returns orig if more is null', async () => {
    const result = appendIf("orig", null);
    expect(result).toBe("orig");
  });

  test('appendif returns concatenated pair', async () => {
    const result = appendIf("orig", "more");
    expect(result).toBe("orig more");
  });

});

