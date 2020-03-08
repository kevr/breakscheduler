// A test for the Tickets reducer in our React
// application. Tests all functions that the
// reducer function provides.
//
import React from 'react';
import Ticket from './Ticket';
import {
  createTicket,
  createReply,
  createReplyChild
} from 'MockObjects';

describe('Tickets reducer', () => {
  test('default is empty array', () => {
    const state = Ticket(undefined, {
      type: "NONE"
    });
    expect(state.resolved).toBe(false);
    expect(state.data).toBeNull();
  });

  test('SET_TICKET overrides a single ticket', () => {
    const ticket = createTicket("Subject", "body", "open", "user@example.com");

    let state = Ticket(undefined, {
      type: "SET_TICKET",
      ticket: ticket
    });
    expect(state.data).toEqual(ticket);

    const newTicket =
      Object.assign({}, createTicket(
        "Modified", "modified body", "open", "user@example.com"
      ), {
        id: ticket.id
      });

    state = Ticket(state, {
      type: "SET_TICKET",
      ticket: newTicket
    });
    expect(state.data).toEqual(newTicket);
  });

  test('SET_REPLY updates a specific reply', () => {
    const replies = [
      createReplyChild("reply 1"),
      createReplyChild("reply 2")
    ];
    const ticket =
      createTicket("Subject", "body", "open", "user@example.com", replies);

    let state = Ticket(undefined, {
      type: "SET_TICKET",
      ticket: ticket
    });

    const newReply = Object.assign({}, ticket.replies[1], {
      body: "Modified body"
    });

    state = Ticket(state, {
      type: "SET_REPLY",
      reply: newReply
    });

    expect(state.data.replies[1]).toEqual(newReply);

  });

  // TODO: Finish these tests
  test('REMOVE_REPLY removes a reply from a ticket', () => {
  });

  test('CLEAR_TICKETS resets the array', () => {
  });


});
