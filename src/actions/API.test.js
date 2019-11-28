import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  apiRequest,
  getRequest,
  postRequest
} from './API';
import { mockPath } from '../lib/TestUtils';
import config from '../config.json';

let axiosMock;

beforeAll(() => {
  axiosMock = new MockAdapter(axios);
});

afterEach(() => {
  axiosMock.reset();
});

test("GET /members returns 200", async () => {
  axiosMock.onGet(mockPath("members")).reply(200, []);
  await getRequest("members").then((response) => {
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual([]);
  });
});

test("GET /members with a token has Authorization header", async () => {
  localStorage.setItem("@authToken", "stubToken");

  let request;
  axiosMock.onGet(mockPath("members")).reply((config) => {
    request = config;
    return [
      200,
      []
    ];
  });

  await getRequest("members").then((response) => {
    expect(response.status).toBe(200);
    console.log(response);
  });

  const headers = request.headers;
  expect(headers["Authorization"]).toBe("Token stubToken");
});

test("POST populates the proper config fields", async () => {
  let request;
  axiosMock.onPost(mockPath("members")).reply((config) => {
    request = config;
    return [
      200,
      []
    ];
  });

  let data;
  await postRequest("members", ["testData"]).then((response) => {
    data = response.data;
  });

  expect(JSON.parse(request.data)).toEqual(["testData"]);
  expect(data).toEqual([]);
});
