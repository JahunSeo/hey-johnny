import React, { Component } from "react";
import { withRouter } from "react-router";
import { Switch, Route, Redirect } from "react-router-dom";
import Field from "./Field";
import Navigation from "./Component/Navigation";

import ArticleQuiz from "./Articles/Quiz";
import ArticleBird from "./Articles/Bird";
import ArticleMidas from "./Articles/Midas";
import ArticleWizlab from "./Articles/Wizlab";
import ArticleXOR from "./Articles/XOR";

import styles from "./App.module.css";

import { PAGES, getScreenRect } from "./Constant";

class App extends Component {
  state = {
    isScreenOn: false,
    isArticleOn: false,
  };

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.resizeEventHandler();
    // // DEBUG // //
    // this.setPage(PAGES.XOR);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventHandler);
  }

  resizeEventHandler = (event) => {
    this.stageWidth = window.innerWidth || document.body.clientWidth;
    this.stageHeight = window.innerHeight || document.body.clientHeight;

    let { params } = this.props.match;
    let currentPage = params && params.id;

    let rect = getScreenRect(this.stageWidth, this.stageHeight, currentPage);
    // console.log("resize", rect);
    this.setState({
      scrW: rect.width,
      scrH: rect.height,
    });
  };

  setPage = (nextPage) => {
    // set url
    if (nextPage === PAGES.MAIN && this.canGoBack) {
      // console.log("go back");
      this.props.history.goBack();
    } else {
      // console.log("push");
      this.canGoBack = true;
      this.props.history.push(`/${nextPage}`);
    }

    // set article
    if (
      nextPage === PAGES.QUIZ ||
      nextPage === PAGES.XOR ||
      nextPage === PAGES.BIRD ||
      nextPage === PAGES.MIDAS ||
      nextPage === PAGES.WIZLAB
    ) {
      let rect = getScreenRect(this.stageWidth, this.stageHeight, nextPage);
      this.setState({
        scrW: rect.width,
        scrH: rect.height,
      });
    } else {
      this.setState({
        isArticleOn: false,
      });
    }
  };

  toggleArticle = (isArticleOn) => {
    this.setState({
      isArticleOn,
    });
  };

  getPageInfo = () => {
    let { params } = this.props.match;
    let currentPage = params && params.id;
    let isScreenOn = false;
    if (
      currentPage === PAGES.QUIZ ||
      currentPage === PAGES.XOR ||
      currentPage === PAGES.BIRD ||
      currentPage === PAGES.MIDAS ||
      currentPage === PAGES.WIZLAB
    ) {
      isScreenOn = true;
    }

    return {
      currentPage,
      isScreenOn,
    };
  };

  render() {
    let { isArticleOn, scrH, scrW } = this.state;
    let { currentPage, isScreenOn } = this.getPageInfo();

    let redirectNeeded = true;
    for (let key in PAGES) {
      if (currentPage === PAGES[key]) redirectNeeded = false;
    }

    if (redirectNeeded) {
      return <Redirect to={`/${PAGES.MAIN}`} />;
    }

    return (
      <div className={styles.body}>
        <div className={styles.NavContainer}>
          <Navigation currentPage={currentPage} setPage={this.setPage} />
        </div>
        <div className={styles.FieldContainer}>
          <Field
            currentPage={currentPage}
            isScreenOn={isScreenOn}
            isArticleOn={isArticleOn}
            setPage={this.setPage}
            toggleArticle={this.toggleArticle}
          />
        </div>
        {isArticleOn && (
          <div
            style={{ width: scrW, height: scrH }}
            className={styles.ArticleContainer}
          >
            <Switch>
              <Route path={`/${PAGES.XOR}`}>
                <ArticleXOR />
              </Route>
              <Route path={`/${PAGES.MIDAS}`}>
                <ArticleMidas />
              </Route>
              <Route path={`/${PAGES.BIRD}`}>
                <ArticleBird />
              </Route>
              <Route path={`/${PAGES.WIZLAB}`}>
                <ArticleWizlab />
              </Route>
              <Route path={`/${PAGES.QUIZ}`}>
                <ArticleQuiz />
              </Route>
            </Switch>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(App);
