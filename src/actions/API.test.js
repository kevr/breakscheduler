import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import axios from 'axios';
import {
  apiRequest,
  getRequest,
  postRequest
} from './API';
import config from '../config.json';

afterEach(() => {
  mockAxios.reset();
});

test("GET /members returns 200", async () => {
  let promise = getRequest("members").then((response) => {
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual([]);
  });
  expect(mockAxios.request).toBeCalled();
  mockAxios.mockResponse({
    data: []
  });
  await promise;
});

test("GET /members with a token has Authorization header", async () => {
  localStorage.setItem("@authToken", "stubToken");

  let promise = getRequest("members").then((response) => {
    expect(response.status).toBe(200);
    console.log(response);
  });

  let request = mockAxios.lastReqGet();

  const { headers } = request.config;
  expect(headers["Authorization"]).toBe("Token stubToken");

  expect(mockAxios.request).toBeCalled();
  mockAxios.mockResponse({
    data: []
  });

  // Wait for our getRequest to be fulfilled.
  await promise;
});

test("POST populates the proper config fields", async () => {
  postRequest("members", ["testData"]);
  let request = mockAxios.lastReqGet();
  expect(request.data).toEqual(["testData"]);
});
