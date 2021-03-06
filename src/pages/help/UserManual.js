import React, { Component } from 'react';
import { connect } from 'react-redux';
import jQuery from 'jquery';
import sanitizeHtml from 'sanitize-html';
import M from 'materialize-css';
import config from '../../config.json';
import ArticleBarrier from '../../components/ArticleBarrier';

class UserManual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winHeight: 0,
      navHeight: "100vh",
      navWidth: 0,
      sidenavOpen: false
    };

    this.resizeFn = this.resizeFn.bind(this);
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

    // Initialize sidenav
    var elems = document.querySelectorAll(".sidenav");
    const options = {
      onOpenStart: () => {
        this.setState({ sidenavOpen: true });
      },
      onCloseStart: () => {
        this.setState({ sidenavOpen: false });
      }
    };
    M.Sidenav.init(elems, options);
    // Save sidenav instance
    this.sidenav = M.Sidenav.getInstance(elems[0]);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFn);
  }

  render() {
    // Height delta, used to produce margins properly for our sidenav.
    const {
      navHeight
    } = this.state;

    // Use redux article store
    const articles = this.props.articles.data;

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

    let sidenavClass = "sidenav textCenter";
    if(this.state.sidenavOpen) {
      sidenavClass += " open";
    }

    return (
      <div className="container">

        <div className="subPage userManual">

          <div
            className="sidenavButton"
            onClick={(e) => {
              e.preventDefault();
              this.sidenav.open();
            }}
            style={{
              top: (navHeight + 10) + "px"
            }}
          >
            <i className="material-icons">bookmarks</i>
          </div>

          <ul
            id="slide-out"
            className={sidenavClass}
          >
            <li><h5>{"Table of Contents"}</h5></li>
            <li>
              <a
                href={"#article_preamble"}
                onClick={(e) => {
                  this.sidenav.close();
                }}
              >
                {"Preamble"}
              </a>
            </li>
            {articles.map((article) => (
              <li key={article.id}>
                <a
                  href={`#article_${article.id}`}
                  onClick={(e) => {
                    this.sidenav.close();
                  }}
                >
                  {article.subject}
                </a>
              </li>
            ))}
          </ul>

          <div className="Section">
            <div className="Content">

              <div
                id="article_preamble"
                className="Article textCenter"
              >
                <h5 id="preambleTitle" className="articleTitle">
                  {"Preamble"}
                </h5>
                <label htmlFor="preambleTitle">
                  {"Intro, Tips and Tricks to the User Manual"}
                </label>
                <p className="textJustify">
                  {"Welcome to our User Manual. Here, you will find detailed "}
                  {`information about all aspects of ${config.appName}. `}
                  {"At any point, you may navigate through the "}
                  {"Table of Contents through a side navigation bar, which "}
                  {"can be accessed by clicking the "}
                  <i className="material-icons textMedium">bookmarks</i>
                  {" icon located in the upper left portion of this page."}
                </p>
              </div>

              <ArticleBarrier>
                {articles.map((article) => (
                  <div id={`article_${article.id}`}
                    className="Article textCenter" key={article.id}>
                    <h5 className="articleTitle">{article.subject}</h5>
                    <p className="textJustify"
                      dangerouslySetInnerHTML={{
                        __html: sanitized(article.body)
                      }} />
                  </div>
                ))}
              </ArticleBarrier>

            </div>
          </div>

        </div>

      </div>
    )
  }
}

const mapState = (state, ownProps) => ({
  articles: state.articles
});

export default connect(mapState)(UserManual);
