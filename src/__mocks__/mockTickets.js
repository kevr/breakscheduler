import React from 'react';

let ticketId = 0;
export const createTicket = (subject, body, status, user, replies) => ({
  id: ++ticketId,
  subject,
  body,
  status,
  user,
  replies,
  created_at: (new Date()).toUTCString(),
  updated_at: (new Date()).toUTCString()
});

let replyId = 0;
export const createReply = (ticket_id, body, user) => ({
  id: ++replyId,
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

