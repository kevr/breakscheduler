import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  SearchBar,
  Row,
  Col,
  Container
} from '../../components';
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
    console.debug(`Updating search terms: ${terms}`);
    this.setState({ searchTerms: terms });
  }

  render() {
    const { searchTerms } = this.state;

    // Convert all terms to lowercase versions
    const terms = searchTerms.map(t => t.toLowerCase());

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

    // Every topic available; topics and articles
    let root = this.props.topics.data.concat(this.props.articles.data);

    let topics = [];
    // If we have filters set, filter out subsets of topics by
    // their filter functions.
    if(this.state.userManualFilter || this.state.qnaFilter) {
      if(this.state.userManualFilter)
        topics = manualFilter(root);
      if(this.state.qnaFilter)
        topics = topics.concat(qnaFilter(root));
    } else {
      // If no filters were provided, all topics are candidates
      topics = root;
    }

    // Return a topic if no terms are given or it exists in the search.
    let filtered = topics.filter((topic) => {
      let exists = false;
      terms.map((term) => {
        if(topic.subject.toLowerCase().includes(term.toLowerCase()))
          exists = true;
        else if(topic.body.toLowerCase().includes(term.toLowerCase()))
          exists = true;
        return null;
      });
      return terms.length === 0 || exists;
    });
    // filtered is the final candidate for display data

    return (
      <Container>
        <div className="searchForm">
          <SearchBar
            id="search-input"
            label="Search help topics..."
            onChange={this.handleSearchChange} 
          />

          <div className="row rowAligned">
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

        <Row>
          <div className="searchResults">
            <div>
              <label>Results</label>
            </div>
            <ArticleBarrier>
              <TopicBarrier>
                {filtered.map((topic, i) => (
                  <Col key={i} s={6} m={6} l={4} xl={3}
                    style={{
                      paddingLeft: "4px",
                      paddingRight: "4px"
                    }}
                  >
                    <Modal
                      id={i}
                      trigger={(
                        <div className="searchResult topic card">
                          <div className="card-content">
                            {topic.type === "topic" ? (
                              <div>
                                <span className="card-title">{topic.subject}</span>
                                <p>{topic.body}</p>
                              </div>
                            ) : (
                              <div>
                                <label>Article</label>
                                <span className="card-title">{topic.subject}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    >
                      <h4>{topic.subject}</h4>
                      <p>{topic.body}</p>
                    </Modal>
                  </Col>
                ))}
              </TopicBarrier>
            </ArticleBarrier>
          </div>
        </Row>

      </Container>
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
