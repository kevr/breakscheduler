import React, { Component } from 'react';
import jQuery from 'jquery';
import sanitizeHtml from 'sanitize-html';
import Layout from '../Layout';
import { getRequest } from '../../actions/API';
import config from '../../config.json';

class UserManual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winHeight: 0,
      navHeight: "100vh",
      navWidth: 0,
      articles: []
    };

    this.resizeFn = this.resizeFn.bind(this);
    
    var self = this;
    getRequest("articles").then((response) => {
      self.setState({ articles: response.data });
    });
  }

  resizeFn() {
    const navHeight = jQuery(".nav-wrapper").height()
                    + jQuery(".nav-extended").height();
    this.setState({
      navHeight: navHeight,
      navWidth: jQuery(".sidenav").width(),
      winHeight: jQuery("window").height()
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFn);
    this.resizeFn();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFn);
  }

  render() {
    // Height delta, used to produce margins properly for our sidenav.
    const delta = 2;
    const {
      winHeight,
      navHeight,
      navWidth,
      articles
    } = this.state;

    // HTML Sanitization helper function. This function takes
    // an article body and sanitizes it with the allowedTags
    // and allowedAttributes defined in config.article.
    // We grab our articles from our API server, so we have
    // no way to know what their content will be from the UI
    // standpoint until we retrieve the content.
    const sanitized = (article) => {
      return sanitizeHtml(article, {
        allowedTags: config.article.allowedTags,
        allowedAttributes: config.article.allowedAttributes
      });
    };

    return (
      <div className="container">

        <div className="Section" style={{ paddingLeft: navWidth }}>
          <ul id="slide-out" className="sidenav sidenav-fixed"
            style={{
              height: (winHeight - navHeight - delta) + "px",
              marginTop: (navHeight + delta) + "px"
            }}>
            <li><h5>{"Table of Contents"}</h5></li>
            {articles.map((article) => (
              <li key={article.id}>
                <a href={`#article_${article.id}`}>{article.title}</a>
              </li>
            ))}
          </ul>

          <div className="Content">

            {articles.map((article) => (
              <div id={`article_${article.id}`}
                className="Article" key={article.id}>
                <h5 className="articleTitle">{article.title}</h5>
                <p className="textJustify"
                  dangerouslySetInnerHTML={{
                    __html: sanitized(article.body)
                  }} />
              </div>
            ))}

          </div>
        </div>

      </div>
    )
  }
}

export default UserManual;
