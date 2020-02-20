import axios from 'axios';
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

  return axios.request({
    url: url,
    method: method,
    headers: head,
    data: data,
    responseType: 'json'
  });
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
export const getSession = () =>
  getRequest("users/me").then(response => response.data);

export const updateSession = (data) => {
  console.debug("updateSession()");
  console.debug(data);
  return patchRequest("users/me", data).then(response => response.data);
};

export const getTickets = () =>
  getRequest("tickets").then(response => response.data);

// Session
export const userLogin = (data) => {
  const endpoint = data.isAdmin ? "users/admin/login" : "users/login";
  return postRequest(endpoint, data).then(response => response.data);
}

// Tickets
export const addTicket = (data) =>
  postRequest("tickets", data)
    .then(response => response.data);

export const updateTicket = (data) =>
  patchRequest(`tickets/${data.id}`, data)
    .then(response => response.data);

export const deleteTicket = (data) =>
  deleteRequest(`tickets/${data.id}`)
    .then(response => response.status);

// Ticket replies
export const addReply = (data) => {
  const ticketId = data.ticket_id;
  return postRequest(`tickets/${ticketId}/replies`, data)
    .then(response => response.data);
}

export const updateReply = (data) => {
  const replyId = data.id;
  const ticketId = data.ticket_id;
  return patchRequest(`tickets/${ticketId}/replies/${replyId}`, data)
    .then(response => response.data);
}

export const deleteReply = (data) => {
  const replyId = data.id;
  const ticketId = data.ticket_id;
  return deleteRequest(`tickets/${ticketId}/replies/${replyId}`)
    .then(response => response.status);
}

