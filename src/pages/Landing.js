import React, { Component } from 'react';
import Layout from './Layout';
import logo from '../logo.svg';
import config from '../config.json';

const Landing = () => (
  <Layout>
    <div className="container">
      <p className="textCenter">
        A simple solution to managing employee breaks and work schedules, {config.appName} was developed to completely remove the necessity of manual book keeping and notifications.
      </p>
    </div>
  </Layout>
);

export default Landing;
