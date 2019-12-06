import React from 'react';

export const createTicket = (id, subject, body, status, user, replies) => ({
  id,
  subject,
  body,
  status,
  user,
  replies,
  created_at: (new Date()).toUTCString(),
  updated_at: (new Date()).toUTCString()
});

export const createReply = (id, ticket_id, body, user) => ({
  id,
  ticket_id,
  body,
  user,
  created_at: (new Date()).toUTCString(),
  updated_at: (new Date()).toUTCString()
});

export const addReply = (ticket, reply) => {
  ticket.replies.concat(reply);
  return ticket;
};

export const removeReply = (ticket, reply) => {
  ticket.replies = ticket.replies.filter(r => r.id !== reply.id);
  return ticket;
}

