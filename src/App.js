import React, { Component } from "react";

import Field from "./Field/Asteroid01";
import Menu from "./Component/Menu";

import ArticleQuiz from "./Articles/Quiz";
import styles from "./App.module.css";

import { PAGES, getScreenRect } from "./Constant";

export default class App extends Component {
  state = {
    currentPage: PAGES.MAIN,
    isScreenOn: false,
    isArticleOn: false,
  };

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.resizeEventHandler();
    // // DEBUG // //
    this.setPage(PAGES.QUIZ);
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
    console.log("setPage", currentPage);
    if (currentPage === PAGES.QUIZ) {
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
      });
    }
  };

  toggleArticle = (isArticleOn) => {
    console.log("toggle Article", isArticleOn);
    this.setState({
      isArticleOn,
    });
  };

  render() {
    let { currentPage, isScreenOn, isArticleOn, scrH, scrW } = this.state;

    console.log("render", this.state);
    return (
      <div className={styles.body}>
        <div className={styles.MenuContainer}>
          <Menu currentPage={currentPage} setPage={this.setPage} />
        </div>
        <div className={styles.FieldContainer}>
          <Field
            currentPage={currentPage}
            isScreenOn={isScreenOn}
            isArticleOn={isArticleOn}
            toggleArticle={this.toggleArticle}
          />
        </div>
        {isArticleOn && (
          <div
            style={{ width: scrW, height: scrH }}
            className={styles.ArticleContainer}
          >
            <ArticleQuiz />
          </div>
        )}
      </div>
    );
  }
}
