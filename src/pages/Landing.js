import React, { Component } from 'react';
import logo from '../logo.svg';
import './Landing.css';

const Landing = () => (
  <div className="Page">

    <div className="Image Section"> 
      <img src={logo} alt="Break Schedulers" />
    </div>

    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

export default Landing;
