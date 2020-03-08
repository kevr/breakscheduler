import React from 'react';
import Layout from './Layout';
import {
  Card
} from '../components';
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
                <button type="button" className="primary btn red lighten-2">
                  {"Download the installer"}
                </button>
              </a>
            </p>
          </Card>
        </div>

        <div className="col s6">
          <Card title={"Purchase"}>
          </Card>
        </div>
      </div>
    </div>

  </Layout>
);

export default Product;
