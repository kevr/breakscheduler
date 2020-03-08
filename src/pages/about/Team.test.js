import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import Team from './Team';
import {
  TestRouter,
  createHistory,
  mockStore,
  mockPath
} from 'TestUtil';
import {
  createMember
} from 'MockObjects';

describe('Team page', () => {

  let axiosMock;
  let container;
  let store;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  beforeEach(() => {
    store = mockStore();
    container = document.createElement('div');
    container.id = "root";
    document.body.appendChild(container);
  });

  afterEach(() => {
    axiosMock.reset();
    document.body.removeChild(container);
    container = null;
  });

  test('shows all users', async () => {
    const history = createHistory("/about/team");

    const member = createMember(
      "Kevin Morris",
      "kevr.gtalk@gmail.com",
      "A cool guy.",
      "Software Engineer"
    );
    const members = [member];

    axiosMock.onGet(mockPath("members")).reply(200, members);

    await act(async () => {
      render(
        <TestRouter store={store} history={history}>
          <Team />
        </TestRouter>
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
    const history = createHistory("/about/team");

    const member = createMember(
      "Kevin Morris",
      "kevr.gtalk@gmail.com",
      "A cool guy.",
      "Software Engineer"
    );
    const members = [member];

    axiosMock.onGet(mockPath("members")).reply(200, members);

    await act(async () => {
      render(
        <TestRouter store={store} history={history}>
          <Team />
        </TestRouter>
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
