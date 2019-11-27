import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Layout from '../Layout';
import config from '../../config.json';

const Contact = () => (
  <Layout pageTitle="Contact Us">

    <div className="container">
      <p className="Intro flow-text">
        {`${config.appName} prides itself on it's ease-of-use and abundance
        of topics which can be found in our `}<Link to="/help">Help</Link>
        {` knowledgebase.`}
      </p>
    </div>

    <div className="container flow-text">
      <p className="Intro">
        {`Need help with something not found in the knowledgebase? Have a
          personal or business inquiry? For any other questions, contact
          our team by sending an email to `}
          <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
        {"."}
      </p>
    </div>

    <div className="container">
      <p className="Intro flow-text">
        {`We look forward to hearing from you!`}
      </p>
    </div>

  </Layout>
);

export default Contact;
