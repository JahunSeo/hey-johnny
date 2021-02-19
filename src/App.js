import React, { Component } from "react";

import Field from "./Field/Asteroid01";
import Menu from "./Component/Menu";
import styles from "./App.module.css";

export const PAGES = {
  MAIN: "PAGE_MAIN",
  CANDY: "PAGE_CANDY",
  QUIZ: "PAGE_QUIZ",
};

export default class App extends Component {
  state = {
    currentPage: PAGES.MAIN,
    isScreenOn: false,
    isArticleOn: false,
  };

  setPage = (currentPage) => {
    console.log("setPage", currentPage);
    let isScreenOn = false;
    if (currentPage === PAGES.QUIZ) {
      isScreenOn = true;
    }

    this.setState({
      currentPage,
      isScreenOn,
    });
  };

  toggleArticle = (isArticleOn) => {
    // console.log("toggle Article", isArticleOn);
    this.setState({
      isArticleOn,
    });
  };

  render() {
    let { currentPage, isScreenOn, isArticleOn } = this.state;

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
          <div className={styles.ArticleContainer}>
            <div>article</div>
          </div>
        )}
      </div>
    );
  }
}
