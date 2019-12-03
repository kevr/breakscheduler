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
    expect(state.resolved).toBe(false);
    expect(state.data).toEqual([]);
  });

  test('SET_TICKETS overrides the whole state', () => {
    const state = Tickets(undefined, {
      type: "SET_TICKETS",
      tickets: [1, 2]
    });
    expect(state.resolved).toBe(true);
    expect(state.data).toEqual([1, 2]);
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

    expect(newState.data).toEqual([
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

    expect(newState.data).toEqual([
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
    expect(newState.data).toEqual([ { id: 2 } ]);
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
    expect(newState.data).toEqual([]);
  });

  test('ADD_REPLY adds a reply to a ticket', () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    const tickets = {
      resolved: true,
      data: [
        {
          id: 1,
          subject: "Test ticket",
          body: "Test body",
          user: user,
          replies: []
        },
        {
          id: 2,
          subject: "Another ticket",
          body: "Another body",
          user: user,
          replies: []
        }
      ]
    };

    const state = Tickets(tickets, {
      type: "ADD_REPLY",
      reply: {
        id: 1,
        ticket_id: 1,
        body: "Reply body",
        user: user
      }
    });

    expect(state.data[0].replies).toEqual([
      {
        id: 1,
        ticket_id: 1,
        body: "Reply body",
        user: user
      }
    ]);
  });

  test('SET_REPLY updates an existing reply in a ticket', () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    const tickets = {
      resolved: true,
      data: [
        {
          id: 1,
          subject: "Test ticket",
          body: "Test body",
          user: user,
          replies: [
            {
              id: 1,
              ticket_id: 1,
              body: "Reply body",
              user: user
            },
            {
              id: 2,
              ticket_id: 1,
              body: "Another reply body",
              user: user
            }
          ]
        },
        {
          id: 2,
          subject: "Another ticket",
          body: "Another ticket body",
          user: user,
          replies: []
        }
      ]
    };

    const state = Tickets(tickets, {
      type: "SET_REPLY",
      reply: {
        id: 1,
        ticket_id: 1,
        body: "Updated body",
        user: user
      }
    });

    expect(state.data[0].replies).toEqual([
      {
        id: 1,
        ticket_id: 1,
        body: "Updated body",
        user: user
      },
      {
        id: 2,
        ticket_id: 1,
        body: "Another reply body",
        user: user
      }
    ]);
  });

  test('REMOVE_REPLY removes a reply from a ticket', () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      type: "user"
    };

    const ticket = {
      resolved: true,
      data: [
        {
          id: 1,
          subject: "Test ticket",
          body: "Test body",
          user: user,
          replies: [{
            id: 1,
            ticket_id: 1,
            body: "Reply body",
            user: user
          }]
        },
        {
          id: 2,
          subject: "Another ticket",
          body: "Another body",
          user: user,
          replies: []
        }
      ]
    };

    // Removing a reply only requires the reply id and ticket_id
    // to be defined in action.reply.
    const state = Tickets(ticket, {
      type: "REMOVE_REPLY",
      reply: {
        id: 1,
        ticket_id: 1
      }
    });

    expect(state.data[0].replies.length).toBe(0);
  });

});
