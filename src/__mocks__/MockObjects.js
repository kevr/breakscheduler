import React from 'react';

// User-related mocks
export const createUser = (name, email) => ({
  id: 1,
  name: name,
  email: email,
  type: "user",
  registered: true
});

export const createAdmin = (name, email) => ({
  id: 2,
  name: name,
  email: email,
  type: "admin",
  registered: true
});

export const createGuest = (email) => ({
  id: null,
  name: '',
  email: email,
  type: "guest",
  registered: false
});

let extraUserId = 2; // A counter used for generating IDs
export const createExtraUser = (name, email) => ({
  id: ++extraUserId,
  name: name,
  email: email,
});

// Ticket-related mocks
let ticketId = 0;
export const createTicket = (subject, body, status, email, replies = []) => {
  ++ticketId;
  return {
    id: ticketId,
    subject: subject,
    body: body,
    status: status,
    email: email,

    // Assign ticket_id and user to all child replies
    replies: replies.map(reply => {
      return Object.assign({}, reply, {
        ticket_id: ticketId,
        email: email
      })
    }),

    created_at: (new Date()).toUTCString(),
    updated_at: (new Date()).toUTCString()
  };
}

let replyId = 0;
export const createReply = (ticket_id, body, user) => ({
  id: ++replyId,
  ticket_id,
  body,
  email: user.email,
  created_at: (new Date()).toUTCString(),
  updated_at: (new Date()).toUTCString()
});

// A special function used to produce reply objects
// that shall be attached to a ticket via createTicket.
//
// Example:
//
// const replies = [
//   createReplyChild("Reply body")
// ];
// const ticket = createTicket("Ticket", "body", "open", user, replies);
//
export const createReplyChild = (body) => ({
  id: ++replyId,
  body: body
});

export const addReply = (ticket, reply) => {
  ticket.replies.concat(reply);
  return ticket;
};

export const removeReply = (ticket, reply) => {
  ticket.replies = ticket.replies.filter(r => r.id !== reply.id);
  return ticket;
}

// Topic-related mocks
let topicId = 0;
export const createTopic = (subject, body) => ({
  id: ++topicId,
  subject: subject,
  body: body
});

let articleId = 0;
export const createArticle = (subject, body) => ({
  id: ++articleId,
  subject: subject,
  body: body
});

let memberId = 0;
export const createMember = (name, email, summary, title) => ({
  id: ++memberId,
  name: name,
  email: email,
  summary: summary,
  title: title,
  avatar: "stubAvatar"
});

