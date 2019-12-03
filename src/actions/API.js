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

