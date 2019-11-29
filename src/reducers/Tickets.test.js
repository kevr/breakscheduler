// A test for the Tickets reducer in our React
// application. Tests all functions that the
// reducer function provides.
//
import React from 'react';
import Tickets from './Tickets';

describe('Tickets reducer', () => {
  test('default is empty array', () => {
    const state = Tickets(undefined, {
      type: "NONE"
    });
    expect(state).toEqual([]);
  });

  test('SET_TICKETS overrides the whole state', () => {
    const state = Tickets(undefined, {
      type: "SET_TICKETS",
      tickets: [1, 2]
    });
    expect(state).toEqual([1, 2]);
  });

  test('SET_TICKET overrides a single ticket', () => {
    const state = Tickets(undefined, {
      type: "SET_TICKETS",
      tickets: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    });

    const newState = Tickets(state, {
      type: "SET_TICKET",
      id: 1,
      ticket: {
        id: 1,
        subject: "A test"
      }
    });

    expect(newState).toEqual([
      { id: 1, subject: "A test" },
      { id: 2 }
    ]);
  });

  test('ADD_TICKET adds a ticket', () => {
    const state = Tickets(undefined, {});
    const newState = Tickets(state, {
      type: "ADD_TICKET",
      ticket: {
        id: 1
      }
    });

    expect(newState).toEqual([
      { id: 1 }
    ]);
  });

  test('REMOVE_TICKET removes a ticket', () => {
    const state = Tickets(undefined, {
      type: "SET_TICKETS",
      tickets: [
        { id: 1 },
        { id: 2 }
      ]
    });
    const newState = Tickets(state, {
      type: "REMOVE_TICKET",
      id: 1
    });
    expect(newState).toEqual([ { id: 2 } ]);
  });

  test('CLEAR_TICKETS resets the array', () => {
    const state = Tickets(undefined, {
      type: "SET_TICKETS",
      tickets: [
        { id: 1 },
        { id: 2 }
      ]
    });
    const newState = Tickets(state, {
      type: "CLEAR_TICKETS"
    });
    expect(newState).toEqual([]);
  });
});
