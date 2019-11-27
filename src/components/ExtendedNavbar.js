import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import M from 'materialize-css';

class ExtendedNavbar extends Component {
  componentDidMount() {
    var elems = document.querySelectorAll(".tabs");
    M.Tabs.init(elems, {});
  }

  render() {
    const { pathname } = this.props.location;
    console.log(`ExtendedNavbar Path: ${pathname}`);

    return (
      <nav className="nav-extended">
        <div className="nav-content">
          <ul className="tabs tabs-transparent">
            {this.props.routes.map((route, i) => (
              <li className="tab" key={i}>
                <Link className={pathname === route.to ? "active" : ""}
                  to={route.to}>
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    )
  }
}

export default withRouter(ExtendedNavbar);

