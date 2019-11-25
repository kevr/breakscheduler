import axios from 'axios';
import config from '../config.json';

export const apiRequest = (method, endpoint, data, headers) => {
  const url = `${config.apiPrefix}/${endpoint}`;
  let head = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  // Provide an Authorization header if we have a token to use.
  const token = localStorage.getItem("@authToken", null);
  if(token) {
    head["Authorization"] = `Token ${token}`;
  }

  return axios({
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

export const postRequest = (endpoint, data) => {
  return apiRequest("POST", endpoint, data, null);
}

export const getRequest = (endpoint) => {
  return apiRequest("GET", endpoint, null, null);
}

