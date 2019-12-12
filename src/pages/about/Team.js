import React, { Component } from 'react';
import M from 'materialize-css';
import Layout from '../Layout';
import Modal from '../../components/Modal';
import { getRequest } from '../../actions/API';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: []
    };
  }

  // UNSAFE_ is used here to avoid deprecation warnings.
  // This should really not be abused, however I have not
  // yet learned how async data fetching should be done
  // via the new methods yet. This seems harmless enough.
  componentDidMount() {
    var self = this;
    getRequest(`members`).then((response) => {
      console.log(response);
      self.setState({ members: response.data });
    });
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
          {/* We should change this header; it looks bad. */}
          <h4 className="textCenter">The Team</h4>

          <p>
            {`Everybody on our team loves to craft practical, useful
            tools that make things easier for day-to-day life. The
            less that people have to worry about, the better
            off they are; that's the way we see it! Less mistakes,
            less trouble and absolute serenity: that's what we believe
            the future holds.`}
          </p>

          <p className="textCenter">
            {"Click on a card below to learn more about one of us!"}
          </p>

          {rows.map((i) => (
            <div className="row" key={i}>
            {members.slice(i, i + 4).map((member, c) => (
              <div className="col s3" key={c}>
                <Modal
                  id={c}
                  trigger={(
                    <div className="card memberCard">
                      <div className="card-image">
                        <img src={member.avatar} alt={member.name} />
                      </div>
                      <div className="card-content">
                        <div className="textCenter memberName">{member.name}</div>
                        <div className="textCenter memberTitle">{member.title}</div>
                      </div>
                    </div>
                  )}
                >
                  <h4>{member.name}</h4>
                  <div className="memberTitle">{member.title}</div>
                  <p>{member.summary}</p>
                </Modal>
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
