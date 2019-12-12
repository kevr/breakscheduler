import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { 
  userLogin,
  getSession,
  getTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  addReply,
  updateReply,
  deleteReply
} from './API';
import { mockPath } from 'TestUtil';
import {
  createUser,
  createTicket,
  createReply
} from 'MockObjects';

describe('API', () => {

  let axiosMock;

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  test('can login', async () => {
    const mockData = {
      email: "test@example.com",
      password: "password",
      isAdmin: false,
      rememberForm: false
    };

    axiosMock.onPost(mockPath("users/login"))
      .reply(200, {
        token: "stubToken"
      });

    await userLogin(mockData).then(data => { 
      expect(data.token).toBe("stubToken");
    });
  });

  test('can login as admin', async () => {
    const mockData = {
      email: "test@example.com",
      password: "password",
      isAdmin: true,
      rememberForm: false
    };

    axiosMock.onPost(mockPath("users/admin/login"))
      .reply(200, {
        token: "stubToken"
      });

    await userLogin(mockData).then(data => { 
      expect(data.token).toBe("stubToken");
    });
  });

  test('can get session', async () => {
    const mockData = createUser("Test User", "test@example.com");

    axiosMock.onGet(mockPath("users/me")).reply(200, mockData);
    await getSession().then(user => {
      expect(user.id).toBe(mockData.id);
      expect(user.name).toBe("Test User");
      expect(user.email).toBe("test@example.com");
      expect(user.type).toBe("user");
    });
  });

  test('can get tickets', async () => {
    const user = createUser("Test User", "test@example.com");
    const mockData = [
      createTicket("Test ticket", "Test body", "open", user, [])
    ];

    axiosMock.onGet(mockPath("tickets")).reply(200, mockData);
    await getTickets().then(tickets => {
      expect(tickets.length).toBe(1);
      expect(tickets[0].id).toBe(mockData[0].id);
      expect(tickets[0].subject).toBe("Test ticket");
      expect(tickets[0].body).toBe("Test body");
      expect(tickets[0].status).toBe("open");
      expect(tickets[0].user).toEqual(user);
      expect(tickets[0].replies).toEqual([]);
    });
  });

  test('can add, update and delete a ticket', async () => {
    const mockData = {
      subject: "Test ticket",
      body: "Test body"
    };

    const user = createUser("Test User", "test@example.com");
    const mockResponse =
      createTicket("Test ticket", "Test body", "open", user, []);

    axiosMock.onPost(mockPath("tickets")).reply(200, mockResponse);
    let newTicket;
    await addTicket(mockData).then(ticket => {
      expect(ticket.id).toBe(mockResponse.id);
      expect(ticket.subject).toBe("Test ticket");
      expect(ticket.body).toBe("Test body");
      newTicket = ticket;
    });

    const updatedTicket = Object.assign({}, newTicket, {
      body: "Altered"
    });

    axiosMock.onPatch(mockPath(`tickets/${mockResponse.id}`))
      .reply(200, updatedTicket);
    await updateTicket(updatedTicket).then(ticket => {
      expect(ticket.body).toBe("Altered");
    });

    axiosMock.onDelete(mockPath(`tickets/${mockResponse.id}`)).reply(200);
    await deleteTicket(updatedTicket).then(statusCode => {
      expect(statusCode).toBe(200);
    });
  });

  test('can add, update and delete a reply on a ticket', async () => {
    const user = createUser("Test User", "test@example.com");
    const ticket = createTicket("Test ticket", "Test body", "open", user, []);
    const mockResponse = createReply(ticket.id, "Test body", user);

    // Add a reply to a ticket.
    axiosMock.onPost(mockPath(`tickets/${ticket.id}/replies`))
      .reply(200, mockResponse);

    let response;
    await addReply(mockResponse).then(reply => {
      expect(reply.body).toBe("Test body");
      response = reply;
    });

    const updatedReply = Object.assign({}, response, {
      body: "Altered"
    });

    const replyId = mockResponse.id;
    axiosMock.onPatch(mockPath(`tickets/${ticket.id}/replies/${replyId}`))
      .reply(200, updatedReply);

    let newReply;
    await updateReply(updatedReply).then(reply => {
      newReply = reply;
    });

    axiosMock.onDelete(mockPath(`tickets/${ticket.id}/replies/${replyId}`))
      .reply(204);
    await deleteReply(newReply).then(statusCode => {
      expect(statusCode).toBe(204);
    });
  });

});

