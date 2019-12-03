import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import Team from './Team';
import config from '../../config.json';
import Reducers from '../../reducers';
import {
  Bootstrap,
  mockPath
} from 'TestUtil';

let axiosMock;
let container;
let store;

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

beforeEach(() => {
  store = createStore(Reducers);
  container = document.createElement('div');
  container.id = "root";
  document.body.appendChild(container);
});

afterEach(() => {
  axiosMock.reset();
  document.body.removeChild(container);
  container = null;
});

describe('Team Page', () => {
  test('shows all users', async () => {
    axiosMock.onGet(mockPath("members")).reply(200, [
      {
        id: 1,
        name: "Kevin Morris",
        email: "kevr.gtalk@gmail.com",
        summary: "A cool guy.",
        title: "Software Engineer",
        avatar: ""
      }
    ]);

    await act(async () => {
      render(
        <Bootstrap store={store} route="/about/team">
          <Team />
        </Bootstrap>
      , container);
    });

    const cards = document.body.querySelectorAll(".memberCard");
    expect(cards.length).toBe(1);

    const card = cards[0];
    expect(card.querySelector(".memberName").textContent)
      .toBe("Kevin Morris");
    expect(card.querySelector(".memberTitle").textContent)
      .toBe("Software Engineer");
  });

  test('card click triggers modal with summary', async () => {
    axiosMock.onGet(mockPath("members")).reply(200, [
      {
        id: 1,
        name: "Kevin Morris",
        email: "kevr.gtalk@gmail.com",
        summary: "A cool guy.",
        title: "Software Engineer",
        avatar: ""
      }
    ]);

    await act(async () => {
      render(
        <Bootstrap store={store} route="/about/team">
          <Team />
        </Bootstrap>
      , container);
    });

    const cards = document.body.querySelectorAll(".memberCard");
    expect(cards.length).toBe(1);

    const card = cards[0];
    fireEvent.click(card);

    await waitForElement(() => document.body.querySelector(".modal.open"));
    const modal = document.body.querySelector(".modal.open");

    expect(modal.querySelector(".modal-content p").textContent)
      .toBe("A cool guy.");

  });
});
