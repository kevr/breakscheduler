import React, { Component } from 'react';
import Layout from './Layout';
import config from '../config.json';
import mainDashboard from '../assets/maindashboard.jpg';
import Image from 'react-image';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navHeight: 0,
      rootHeight: 0
    };

    this.onResize = this.onResize.bind(this);
    this.getScreenHeight = this.getScreenHeight.bind(this);
    this.getFullHeight = this.getFullHeight.bind(this);
  }

  componentDidMount() {
    this.onResize(); // Fire this once on mount
    window.addEventListener("resize", this.onResize);
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    // Update local height states when we resize; causes a re-render
    // if our heights differ.
    this.setState({
      navHeight: document.querySelector("nav").clientHeight,
      rootHeight: document.getElementById("root").clientHeight
    });
  }

  getScreenHeight() {
    // Just get the height of the portion of the window below the navbar
    return (this.state.rootHeight - this.state.navHeight) + "px";
  }

  getFullHeight() {
    // Get the entire height of the window
    return this.state.rootHeight + "px";
  }

  render() {
    return (
      <Layout>
        <div className="container">

          <div className="row">
            <div className="col s12" style={{ height: this.getScreenHeight() }}>
              <Image
                style={{ float: "right", margin: "6px" }}
                src={mainDashboard}
                alt={config.appName}
                width={"500px"}
                height={"auto"}
              ></Image>
              <h4>Welcome</h4>
              <p className="textMedium">{`${config.appName} is an automated solution to managing employee breaks and work schedules. Completely simplify your scheduling of repetitive tasks with the click of a button!`}</p>
              <p className="textMedium">{`Add up to 50 employees, generate exports and imports, notify staff by email; all without any manual intervention!`}</p>
              <div className="clear" />
            </div>
          </div>

          <div className="row">
            <div className="col s12" style={{ height: this.getFullHeight() }}>
              <Image
                style={{ float: "left", margin: "6px" }}
                src={mainDashboard}
                alt={config.appName}
                width={"500px"}
                height={"auto"}
              ></Image>
              <h4 className="textRight">Welcome</h4>
              <p className="textMedium">{`${config.appName} is an automated solution to managing employee breaks and work schedules. Completely simplify your scheduling of repetitive tasks with the click of a button!`}</p>
              <p className="textMedium">{`Add up to 50 employees, generate exports and imports, notify staff by email; all without any manual intervention!`}</p>
              <div className="clear" />
            </div>
          </div>

        </div>
      </Layout>
    )
  }
}

export default Landing;
