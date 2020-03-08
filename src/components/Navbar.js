import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import M from 'materialize-css';
import PropTypes from 'prop-types';
import config from '../config.json';

// A set of dynamic route-dependent rendering functions.
// NavItem sets it's className property as active in
// the case that isActive is true.
const isActive = (path, to) => {
  return path === to
    || (to === "/help" && path.startsWith("/help"));
};

const _NavItem = ({ location, label, to }) => (
  <li className={isActive(location.pathname, to) ? "active" : ""}>
    <Link to={to}>{label}</Link>
  </li>
);

_NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

const NavItem = withRouter(_NavItem);

class Navbar extends Component {
  componentDidMount() {
    let elems = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(elems, {
      inDuration: 300,
      outDuration: 255,
      coverTrigger: false,
      constrainWidth: false
    });
  }

  render() {
    const isNested = this.props.location.pathname.startsWith("/about");
    return (
      <div>
        <ul id="about-dropdown" className="dropdown-content red lighten-2">
          <NavItem label="The Team" to="/about/team" />
          <NavItem label="Contact Us" to="/about/contact" />
        </ul>
        <nav id="main-navigation">
          <div className="nav-wrapper">
            <div className="container">
              <a href="#!" className="brand-logo left">{config.appName}</a>
              <ul id="nav-mobile" className="right">
                <NavItem label="Home" to="/" />
                <NavItem label="Features" to="/features" />
                <NavItem label="Get It" to="/product" />
                <NavItem label="Help" to="/help" />
                <li className={isNested ? "active" : ""}>
                  <a className="dropdown-trigger" href="#!"
                     data-target="about-dropdown">About</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
};

export default withRouter(Navbar);
