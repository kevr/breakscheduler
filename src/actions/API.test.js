import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
  apiRequest,
  getRequest,
  postRequest,
  patchRequest
} from './API';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import config from '../config.json';

let axiosMock;
let token;

beforeEach(() => {
  axiosMock = new MockAdapter(axios);
});

const userLogin = () => {
  return postRequest("users/login", {
    username: "test@example.com",
    password: "password"
  }).then((response) => {
    return response.data;
  });
};

test("GET /members returns 200", async () => {
  axiosMock.onGet(`${config.apiPrefix}/members`).reply(200, []);
  await getRequest("members").then((response) => {
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual([]);
  });
});

test("POST /users/login returns an auth token", async () => {
  axiosMock.onPost(`${config.apiPrefix}/users/login`).reply(200, {
    token: "stubToken"
  });
  await userLogin().then((data) => {
    token = data.token;
  });
  expect(token).not.toBeNull();
});

test("GET /members with a token has Authorization header", async () => {
  let headers = {};
  axiosMock.onGet(`${config.apiPrefix}/members`).reply((config) => {
    headers = config.headers;
    return [200, []];
  });

  expect(token).not.toBeNull();
  localStorage.setItem("@authToken", token);

  await getRequest("members").then((response) => {
    expect(response.status).toBe(200);
    expect(headers["Authorization"]).toBe("Token stubToken");
  });
});
