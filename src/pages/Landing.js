import React, { Component } from 'react';
import Layout from './Layout';
import config from '../config.json';
import mainDashboard from '../assets/maindashboard.jpg';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import constructionImage from '../assets/hires/construction.jpg';
import {
  Collection,
  Section,
  Container,
  Row,
  Col
} from '../components';

class Landing extends Component {
  render() {
    const images = [
      { src: constructionImage, legend: "Get Work Done" },
      { src: constructionImage, legend: "Stay Up To Date" },
      { src: constructionImage, legend: "Automate Your Schedules" },
    ];

    const { Item } = Collection;

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
                <img src={image.src} alt={image.legend} />
                <p className="legend">{image.legend}</p>
              </div>
            ))}
          </Carousel>
        </div>

        <Section
          title={(
            <h4 className="frameTitle textLeft">
              {"Download Now"}
            </h4>
          )}
        >
          <Row>
            <Col s={6}>
              <Collection>
                <Item>{"30 Day Free Trial"}</Item>
                <Item>{"Blah2"}</Item>
              </Collection>
            </Col>
            <Col s={6}>
            </Col>
          </Row>
        </Section>

        <Section
          title={(
            <h4 className="frameTitle textCenter">
              {"Total Control"}
            </h4>
          )}
        >
          <div className="textCenter">
            <p className="frameText">{"Some overly detailed text about how much control this program can give you. "}<Link to="/product">Get it here.</Link></p>
            <img
              alt={`${config.appName} Dashboard`}
              className="frameImage"
              src={mainDashboard}
            />
          </div>
        </Section>

        <Section
          title={(
            <h4 className="frameTitle textLeft">
              {"Product Features"}
            </h4>
          )}
        >
          <div className="textCenter">
            <p className="frameText">{"Some overly detailed text about how much control this program can give you. Visit our "}<Link to="/features">Features</Link>{" page to see them all!"}</p>
            <ul>
              <li><span>{"Feature one"}</span></li>
              <li><span>{"Feature two"}</span></li>
            </ul>
          </div>
        </Section>

        <Section
          title={(
            <h4 className="frameTitle textRight">
              {"Help Directory"}
            </h4>
          )}
        >
          <div className="textCenter">
            <p className="frameText">{"Some overly detailed text about how much control this program can give you. Visit our "}<Link to="/features">Features</Link>{" page to see them all!"}</p>
          </div>
        </Section>

      </Layout>
    )
  }
}

export default Landing;
