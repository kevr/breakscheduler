import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';

const Layout = ({ pageTitle, children }) => (
  <div className="Layout">

    {pageTitle !== null && (
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
    )}

    <Navbar />

    <div className="Page">
      {children}
    </div>
  </div>
);

Layout.defaultProps = {
  pageTitle: null
};

export default Layout;
