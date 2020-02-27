import React, { Component } from 'react';
import Layout from './Layout';
import config from '../config.json';
import mainDashboard from '../assets/maindashboard.jpg';
import Image from 'react-image';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import constructionImage from '../assets/hires/construction.jpg';

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
    const images = [
      { src: constructionImage, legend: "Get Work Done" },
      { src: constructionImage, legend: "Stay Up To Date" },
      { src: constructionImage, legend: "Automate Your Schedules" },
    ];

    return (
      <Layout>
        <div>
          <Carousel
            className="carousel-wrapper"
            showArrows={true}
            infiniteLoop={true}
            autoPlay={true}
            showThumbs={false}
          >
            {images.map((image, i) => (
              <div key={i}>
                <img src={image.src} />
                <p className="legend">{image.legend}</p>
              </div>
            ))}
          </Carousel>
        </div>
        <div className="widePageFrame pageSection">
          <div className="textCenter">
            <h4 className="frameTitle">Total Control</h4>
            <p className="frameText">{"Some overly detailed text about how much control this program can give you. "}<Link to="/product">Get it here.</Link></p>
            <img
              className="frameImage"
              src={mainDashboard}
            />
          </div>
        </div>

        <div className="widePageFrame pageSection">
          <div className="textCenter">
            <h4 className="frameTitle textLeft">Product Features</h4>
            <p className="frameText">{"Some overly detailed text about how much control this program can give you. Visit our "}<Link to="/features">Features</Link>{" page to see them all!"}</p>
            <ul>
              <li><span>{"Feature one"}</span></li>
              <li><span>{"Feature two"}</span></li>
            </ul>
          </div>
        </div>

        <div className="widePageFrame pageSection">
          <div className="textCenter">
            <h4 className="frameTitle textRight">Help Directory</h4>
            <p className="frameText">{"Some overly detailed text about how much control this program can give you. Visit our "}<Link to="/features">Features</Link>{" page to see them all!"}</p>
          </div>
        </div>



      </Layout>
    )
  }
}

export default Landing;
