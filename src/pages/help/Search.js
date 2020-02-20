import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRequest } from '../../actions/API';
import Modal from '../../components/Modal';
import SearchComponent from '../../components/Search';
import {
  TextInput,
  Checkbox
} from '../../components/Input';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerms: [],

      userManualFilter: false,
      qnaFilter: false
    };

    // Memoization dict for lookups
    this.converted = {};
    this.modals = {};

    this.handleSearchChange = this.handleSearchChange.bind(this);
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

  render() {
    let self = this;

    const { searchTerms } = this.state;
    const { topics } = this.props;
    console.log(`Topics: ${topics.length}`);

    // Convert all terms to lowercase versions
    const terms = searchTerms.map(t => t.toLowerCase());
    console.log(`Terms: ${terms}`);

    let qnaFilter = (topics) => {
      return topics;
    };
    if(this.state.qnaFilter) {
      qnaFilter = (topics) => {
        return topics;
      };
    }

    let manualFilter = (topics) => {
      return topics;
    };
    if(this.state.userManualFilter) {
      manualFilter = (topics) => {
        return topics;
      };
    }

    console.log("User Manual: " + this.state.userManualFilter);
    console.log("QnA: " + this.state.qnaFilter);

    // Include topics in the redux store if either their
    // subject or body includes one of the given searchTerms.
    // If we have no searchTerms, we provide every topic.
    let filtered = topics.filter((topic) => {
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

    // Filter different types of topics. These functions are identity
    // functions if the filter checkboxes are not activated.
    filtered = manualFilter(qnaFilter(filtered));

    return (
      <div className="container">
        <div className="searchForm">
          <SearchComponent
            id="search-input"
            label="Search help topics..."
            onChange={this.handleSearchChange} 
          />

          <div className="row">
            <div className="input-field">
              <div>
                <label className="aligned">{"Search Filters"}</label>
              </div>
              <div>
                <Checkbox
                  id="user-manual-checkbox"
                  className="aligned"
                  label="User Manual"
                  checked={this.state.userManualFilter}
                  onChange={(e) => {
                    this.setState({
                      userManualFilter: !this.state.userManualFilter
                    });
                  }}
                />
                <Checkbox
                  id="qna-checkbox"
                  className="aligned"
                  label="QnA"
                  checked={this.state.qnaFilter}
                  onChange={(e) => {
                    this.setState({ qnaFilter: !this.state.qnaFilter });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="searchResults row">
          {filtered.map((topic, i) => (
            <span key={i}>
              <div className="col s6 m6 l4 xl3"
                style={{
                  padding: "4px"
                }}
              >
                <Modal
                  id={i}
                  trigger={(
                    <div className="searchResult topic card">
                      <div className="card-content">
                        <span className="card-title">{topic.subject}</span>
                        <p>{topic.body}</p>
                      </div>
                    </div>
                  )}
                >
                  <h4>{topic.subject}</h4>
                  <p>{topic.body}</p>
                </Modal>
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
