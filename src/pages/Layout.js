import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import config from '../config.json';

const Layout = ({ pageTitle, children }) => (
  <div className="Layout">

    {
      // If a pageTitle was supplied, append it to
      // our base web title. Otherwise, set the title
      // to the base: Break Scheduler.
    }
    {pageTitle !== null ? (
      <Helmet>
        <title>{config.appName} - {pageTitle}</title>
      </Helmet>
    ) : (
      <Helmet>
        <title>{config.appName}</title>
      </Helmet>
    )}

    <Navbar />

    <div className="Page" title={pageTitle}>
      {children}
    </div>
  </div>
);

Layout.defaultProps = {
  pageTitle: null
};

export default Layout;
