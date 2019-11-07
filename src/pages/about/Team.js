import React, { Component } from 'react';
import axios from 'axios';
import M from 'materialize-css';
import Layout from '../Layout';
import Modal from '../../components/Modal';
import config from '../../config.json';

class Team extends Component {
  state = {
    members: []
  }

  // UNSAFE_ is used here to avoid deprecation warnings.
  // This should really not be abused, however I have not
  // yet learned how async data fetching should be done
  // via the new methods yet. This seems harmless enough.
  UNSAFE_componentWillMount() {
    var self = this;
    axios(`${config.apiPrefix}/members`).then((response) => {
      console.log(response);
      self.setState({ members: response.data });
    });
  }

  triggerModal(i) {
    var elem = document.getElementById(`modal${i}`);
    var instance = M.Modal.getInstance(elem);
    instance.open();
  }

  render() {
    const { members } = this.state;
    const n = Math.ceil((members.length / 4) % 4);
    var rows = [];
    for(var i = 0; i < n; ++i)
      rows.push(i * 4);

    console.log(`Rows: ` + JSON.stringify(rows));
    const leftOver = members.length % 4;

    console.log(`Left over columns: ${leftOver}`);
    console.log(`Member rows: ${rows}`);

    return (
      <Layout pageTitle="The Team">
        <div className="container InnerPage">

          <h4 className="PageHeading">The Team</h4>
          <p className="Intro flow-text">
            Everybody on our team loves to craft practical, useful tools that make things easier for day-to-day life. The less that people have to worry about, the better off they are! Less mistakes, more convenience, and absolute serenity: that's what we believe the future holds.
          </p>

          <p className="Intro flow-text">
            Click on a card to learn more about one of us!
          </p>

          {rows.map((i) => (
            <div className="row" key={i}>
            {members.slice(i, i + 4).map((member, c) => (
              <div className="col s3" key={c}>
                <Modal id={c}>
                  <h4>{member.name}</h4>
                  <div className="memberTitle">{member.title}</div>
                  <p>{member.summary}</p>
                </Modal>
                <div className="card memberCard" onClick={e => this.triggerModal(c)}>
                  <div className="card-image">
                    <img src={member.avatar} />
                  </div>
                  <div className="card-content">
                    <div className="text-center memberName">{member.name}</div>
                    <div className="text-center memberTitle">{member.title}</div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          ))}

        </div>
      </Layout>
    );
  }
};

export default Team;
