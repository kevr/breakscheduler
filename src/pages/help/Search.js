import React, { Component } from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css';
import { getRequest } from '../../actions/API';
import Modal from '../../components/Modal';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawString: '',
      searchTerms: []
    };

    // Memoization dict for lookups
    this.converted = {};

    this.onSearchChange = this.onSearchChange.bind(this);
    this.triggerModal = this.triggerModal.bind(this);
  }

  componentDidMount() {
    console.log(`Current topic count on mount: ${this.props.topics.length}`);
    if(this.props.topics.length === 0) {
      const { pushTopics } = this.props;
      getRequest("topics").then((response) => {
        console.log(response.data);
        pushTopics(response.data);
      });
    }
  }

  onSearchChange(e) {
    const raw = e.target.value.split(/\s(?=(?:[^"]|"[^"]*")*$)/)
    const terms = raw.map((t) => {
      return t.replace(new RegExp('"', 'g'), '');
    });
    console.log(terms);
    this.setState({
      rawString: e.target.value,
      searchTerms: terms.filter((t) => t.length > 0)
    });
  }

  triggerModal(i) {
    var elem = document.getElementById(`modal${i}`);
    var instance = M.Modal.getInstance(elem);
    instance.open();
  }

  render() {
    let self = this;

    const { searchTerms } = this.state;
    const { topics } = this.props;
    console.log(`Topics: ${topics.length}`);

    // Convert all terms to lowercase versions
    const terms = searchTerms.map(t => t.toLowerCase());
    console.log(`Terms: ${terms}`);
    // Include topics in the redux store if either their
    // subject or body includes one of the given searchTerms.
    // If we have no searchTerms, we provide every topic.
    const filtered = topics.filter((topic) => {
      const hasTerm = terms.some((term) => {
        // Convert and memoize topics
        if(!self.converted.hasOwnProperty(topic.id)) {
          self.converted[topic.id] = {
            subject: topic.subject.toLowerCase(),
            body: null
          }
        }
        return self.converted[topic.id].subject.includes(term);
      }) || terms.some((term) => {
        // Convert bodies if needed
        if(!self.converted[topic.id].body) {
          self.converted[topic.id].body = topic.body.toLowerCase();
        }
        return self.converted[topic.id].body.includes(term);
      });
      return terms.length === 0 || hasTerm;
    });

    return (
      <div className="container">
        <div className="searchForm">
          <div className="input-field">
            <i className="material-icons prefix">search</i>
            <input id="search-input" type="text"
              value={this.state.rawString}
              onChange={this.onSearchChange} />
            <label htmlFor="search-input">{"Search help topics..."}</label>
          </div>
        </div>

        <div className="searchResults row">
          {filtered.map((topic, i) => (
            <span key={i}>
              <Modal id={i}>
                <h4>{topic.subject}</h4>
                <p>{topic.body}</p>
              </Modal>
              <div className="col s6 m6 l4 xl3"
                style={{
                  padding: "4px"
                }}
              >
                <div className="searchResult topic card"
                  onClick={e => this.triggerModal(i)}
                >
                  <div className="card-content">
                    <span className="card-title">{topic.subject}</span>
                    <p>{topic.body}</p>
                  </div>
                </div>
              </div>
            </span>
          ))}
        </div>
      </div>
    )
  }
}

const mapState = (state, ownProps) => ({
  topics: state.topics
});

const mapDispatch = (dispatch, ownProps) => ({
  pushTopics: (topics) => {
    dispatch({
      type: "PUSH_TOPICS",
      topics: topics
    });
  }
});

export default connect(mapState, mapDispatch)(Search);
