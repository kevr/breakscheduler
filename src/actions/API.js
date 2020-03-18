import axios, { CancelToken } from 'axios';
import config from '../config.json';

export const apiRequest = (method, endpoint, data) => {
  const url = `${config.apiPrefix}/${endpoint}`;
  var head = {};

  // Provide an Authorization header if we have a token to use.
  const token = localStorage.getItem("@authToken", null);
  if(token) {
    console.log(`Using token authorization: ${token}`);
    head["Authorization"] = `Token ${token}`;
  }

  let cancel;
  let p = axios.request({
    url: url,
    method: method,
    headers: head,
    data: data,
    responseType: 'json',
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  });
  p._cancel = cancel;
  return p;
}

/* To be uncommented and tested when used.
export const patchRequest = (endpoint, data) => {
  return apiRequest("PATCH", endpoint, data, null);
} */

export const postRequest = (endpoint, data) =>
  apiRequest("post", endpoint, data);

export const getRequest = (endpoint) =>
  apiRequest("get", endpoint, null);

export const patchRequest = (endpoint, data) =>
  apiRequest("patch", endpoint, data);

export const deleteRequest = (endpoint) =>
  apiRequest("delete", endpoint, null);

// Abstracted API methods.
export const getSession = (key) => {
  let path = "users/me";
  if(key) {
    path = path + `?key=${key}`;
  }
  return getRequest(path)
    .then(response => response.data);
};

export const updateSession = (data) => {
  return patchRequest("users/me", data).then(response => response.data);
};

export const getTickets = () =>
  getRequest("tickets").then(response => response.data);

export const getTicket = (id, key) => {
  let path = `tickets/${id}`;
  if(key) {
    path = path + `?key=${key}`;
  }
  return getRequest(path).then(response => response.data);
}

// Session
export const userLogin = (data) => {
  const endpoint = data.isAdmin ? "users/admin/login" : "users/login";
  return postRequest(endpoint, data).then(response => response.data);
}

// Tickets
export const addTicket = (data) =>
  postRequest("tickets", data)
    .then(response => response.data);

export const updateTicket = (data, key) => {
  const ticketId = data.id;

  let path = `tickets/${ticketId}`;
  if(key) {
    path = path + `?key=${key}`;
  }

  return patchRequest(path, data)
    .then(response => response.data);
}

export const deleteTicket = (data) =>
  deleteRequest(`tickets/${data.id}`)
    .then(response => response.status);

// Ticket replies
export const addReply = (data, key) => {
  const ticketId = data.ticket_id;

  let path = `tickets/${ticketId}/replies`;
  if(key) {
    path = path + `?key=${key}`;
  }

  return postRequest(path, data).then(response => response.data);
}

export const updateReply = (data, key) => {
  const replyId = data.id;
  const ticketId = data.ticket_id;

  let path = `tickets/${ticketId}/replies/${replyId}`;
  if(key) {
    path = path + `?key=${key}`;
  }

  console.log(`Ticket path: ${path}`);
  return patchRequest(path, data).then(response => response.data);
}

export const deleteReply = (data, key) => {
  const replyId = data.id;
  const ticketId = data.ticket_id;

  let path = `tickets/${ticketId}/replies/${replyId}`;
  if(key) {
    path = path + `?key=${key}`;
  }

  return deleteRequest(path).then(response => response.status);
}

export const getArticles = () =>
  getRequest("articles").then(response => response.data);

export const getTopics = () =>
  getRequest("topics").then(response => response.data);

