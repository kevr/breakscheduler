import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import M from 'materialize-css';

class ExtendedNavbar extends Component {
  render() {
    const { pathname } = this.props.location;
    console.log(`ExtendedNavbar Path: ${pathname}`);

    const isActive = (pathname, route) => {
      return pathname === route.to
        || (route.to.startsWith("/help/support")
          && pathname.startsWith("/help/support"));
    };

    return (
      <nav className="nav-extended">
        <div className="nav-content container">
          <ul className="tabs tabs-transparent">
            {this.props.routes.map((route, i) => (
              <li className="tab" key={i}>
                <Link
                  to={route.to}
                  className={isActive(pathname, route) ? "active" : ""}
                >
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

