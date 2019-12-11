import React, { Component } from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css';
import { getRequest } from '../../actions/API';
import Modal from '../../components/Modal';
import SearchComponent from '../../components/Search';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerms: []
    };

    // Memoization dict for lookups
    this.converted = {};

    this.handleSearchChange = this.handleSearchChange.bind(this);
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

  handleSearchChange(terms) {
    this.setState({ searchTerms: terms });
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
          <SearchComponent
            id="search-input"
            label="Search help topics..."
            onChange={this.handleSearchChange} 
          />
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
