import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const NotFound = () => (
  <Layout pageTitle="Not Found">
    <h4 className="textCenter">404 - Not Found</h4>
    <p className="textCenter">
      Visit <Link to="/">Home</Link> to find what you're looking for.
    </p>
  </Layout>
);

export default NotFound;
