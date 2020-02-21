import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getArticles } from '../actions/API';

class ArticleBarrier extends Component {
  componentDidMount() {
    console.log("ArticleBarrier.componentDidMount");
    const {
      articles,
      setArticles,
      clearArticles
    } = this.props;
    if(!articles.resolved) {
      getArticles().then(articles => setArticles(articles))
        .catch(error => {
          console.error(error);
          clearArticles();
        });
    }
  }

  render() {
    console.log("ArticleBarrier.render");
    const {
      children
    } = this.props;

    return (
      <span className="articlesProbe">
        {children}
      </span>
    );
  }
}

const mapState = (state, ownProps) => ({
  articles: state.articles
});

const mapDispatch = (dispatch, ownProps) => ({
  setArticles: (articles) => dispatch({
    type: "SET_ARTICLES",
    articles: articles
  }),
  clearArticles: () =>
    dispatch({ type: "CLEAR_ARTICLES" }),
});

export default connect(mapState, mapDispatch)(ArticleBarrier);
