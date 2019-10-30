import React, { Component } from 'react';
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
          <li><a href="#">The Team</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
        <nav>
          <div className="nav-wrapper">
            <div className="container">
              <a href="#!" className="brand-logo left">{"Break Scheduler"}</a>
              <ul id="nav-mobile" className="right">
                <li><a href="#">Home</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">Help</a></li>
                <li><a href="#">Get It</a></li>
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
