import React from 'react';
import Layout from './Layout';
import {
  Card
} from '../components';
import { colorStyle } from '../lib/Style';
import config from '../config.json';

const Product = () => (
  <Layout pageTitle="Product">

    <div className="container">
      <div className="row">

        <div className="col s6">
          <Card title={`Download`}>
            <p className="frameText">
              {`Each installation of ${config.appName} comes with a free 30 day trial period.`}
            </p>
            <p className="frameText textCenter">
              <a href={`${config.download.url}`}>
                <button type="button"
                  className="primary btn"
                  style={colorStyle()}
                >
                  {"Download the installer"}
                </button>
              </a>
            </p>
          </Card>
        </div>

        <div className="col s6">
          <Card title={"Purchase"}>
            <ul className="collection">
              <li className="collection-item">{"Licensed forever"}</li>
              <li className="collection-item">{"Premium support"}</li>
              <li className="collection-item">{"Most affordable in the market"}</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>

  </Layout>
);

export default Product;
