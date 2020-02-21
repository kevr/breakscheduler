import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../../components/Modal';
import SearchComponent from '../../components/Search';
import {
  Checkbox
} from '../../components/Input';
import ArticleBarrier from '../../components/ArticleBarrier';
import TopicBarrier from '../../components/TopicBarrier';

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

  handleSearchChange(terms) {
    this.setState({ searchTerms: terms });
  }

  render() {
    let self = this;

    const { searchTerms } = this.state;

    // Convert all terms to lowercase versions
    const terms = searchTerms.map(t => t.toLowerCase());
    console.log(`Terms: ${terms}`);

    let qnaFilter = null;
    if(this.state.qnaFilter) {
      qnaFilter = (topics) => {
        return topics.filter(topic => topic.type === "topic");
      };
    }

    let manualFilter = null;
    if(this.state.userManualFilter) {
      manualFilter = (topics) => {
        return topics.filter(topic => topic.type === "article");
      };
    }

    let root = this.props.topics.data.concat(this.props.articles.data);
    console.log(root);
    let topics = [];
    // If we have filters, filter subsets of topics
    if(this.state.userManualFilter || this.state.qnaFilter) {
      if(this.state.userManualFilter)
        topics = manualFilter(root);
      if(this.state.qnaFilter)
        topics = topics.concat(qnaFilter(root));
    } else {
      topics = root;
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
          <ArticleBarrier>
            <TopicBarrier>
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
            </TopicBarrier>
          </ArticleBarrier>
        </div>

      </div>
    )
  }
}

const mapState = (state, ownProps) => ({
  topics: Object.assign({}, state.topics, {
    data: state.topics.data.map((topic) => {
      return Object.assign({}, topic, {
        type: "topic"
      });
    })
  }),
  articles: Object.assign({}, state.articles, {
    data: state.articles.data.map((article) => {
        return Object.assign({}, article, {
          type: "article"
        })
    })
  })
});

export default connect(mapState)(Search);
