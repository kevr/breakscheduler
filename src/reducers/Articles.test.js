import React from 'react';
import Articles, {
  SET_ARTICLES,
  CLEAR_ARTICLES
} from './Articles';

describe('Articles reducer', () => {

  test('default returns defaultState', () => {
    const state = Articles(undefined, {});
    expect(state.resolved).toBe(false);
    expect(state.data).toEqual([]);
  });

  test('SET_ARTICLES returns new articles state', () => {
    const state = Articles(undefined, {
      type: SET_ARTICLES,
      articles: ['article1', 'article2']
    });
    expect(state.resolved).toBe(true);
    expect(state.data).toEqual(['article1', 'article2']);
  });

  test('CLEAR_MESSAGE returns defaultState', () => {
    const state = Articles({
      type: SET_ARTICLES,
      articles: ['article1', 'article2']
    }, {
      type: CLEAR_ARTICLES
    });
    expect(state.resolved).toBe(true);
    expect(state.data).toEqual([]);
  });

});
