import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css';

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
    return (
      <div>
        <ul id="about-dropdown" className="dropdown-content red lighten-2">
          <li><Link to="/about/team">The Team</Link></li>
          <li><Link to="/about/contact">Contact Us</Link></li>
        </ul>
        <nav>
          <div className="nav-wrapper">
            <div className="container">
              <a href="#!" className="brand-logo left">{"Break Scheduler"}</a>
              <ul id="nav-mobile" className="right">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/help">Help</Link></li>
                <li><Link to="/product">Get It</Link></li>
                <li>
                  <a className="dropdown-trigger" href="#!"
                     data-target="about-dropdown">About Us</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
};

export default Navbar;
