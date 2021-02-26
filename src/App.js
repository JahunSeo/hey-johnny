import React, { Component } from "react";
import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";
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
    currentPage: PAGES.MAIN,
    isScreenOn: false,
    isArticleOn: false,
  };

  componentDidMount() {
    const { history } = this.props;
    history.listen((newLocation, action) => {
      if (action === "PUSH") {
        console.log("history push");
      } else if (action === "POP") {
        console.log("history pop");
        // history.go(1);
      }
    });

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
    let rect = getScreenRect(
      this.stageWidth,
      this.stageHeight,
      this.state.currentPage
    );
    // console.log("resize", rect);
    this.setState({
      scrW: rect.width,
      scrH: rect.height,
    });
  };

  setPage = (currentPage) => {
    // console.log("setPage", currentPage);
    this.props.history.push(`/${currentPage}`);
    if (
      currentPage === PAGES.QUIZ ||
      currentPage === PAGES.XOR ||
      currentPage === PAGES.BIRD ||
      currentPage === PAGES.MIDAS ||
      currentPage === PAGES.WIZLAB
    ) {
      let rect = getScreenRect(this.stageWidth, this.stageHeight, currentPage);
      this.setState({
        currentPage,
        isScreenOn: true,
        scrW: rect.width,
        scrH: rect.height,
      });
    } else {
      this.setState({
        currentPage,
        isScreenOn: false,
        isArticleOn: false,
      });
    }
  };

  toggleArticle = (isArticleOn) => {
    this.setState({
      isArticleOn,
    });
  };

  render() {
    let { currentPage, isScreenOn, isArticleOn, scrH, scrW } = this.state;

    // let Article;
    // if (currentPage === PAGES.QUIZ) Article = ArticleQuiz;
    // else if (currentPage === PAGES.XOR) Article = ArticleXOR;
    // else if (currentPage === PAGES.BIRD) Article = ArticleBird;
    // else if (currentPage === PAGES.MIDAS) Article = ArticleMidas;
    // else if (currentPage === PAGES.WIZLAB) Article = ArticleWizlab;

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
            {/* <Article /> */}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(App);
