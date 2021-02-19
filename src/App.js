import React, { Component } from "react";

import Field from "./Field/Asteroid01";
import Menu from "./Component/Menu";

import ArticlePsychometric from "./Articles/Psychometric";
import styles from "./App.module.css";

export const PAGES = {
  MAIN: "PAGE_MAIN",
  CANDY: "PAGE_CANDY",
  PSYCH: "PAGE_PSYCH",
};

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

    this.setState({
      currentPage: PAGES.PSYCH,
      isScreenOn: true,
      isArticleOn: false,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventHandler);
  }

  resizeEventHandler = (event) => {
    this.stageWidth = window.innerWidth || document.body.clientWidth;
    this.stageHeight = window.innerHeight || document.body.clientHeight;
    let ratio = { w: 3, h: 2 }; // todo: vertical ratio
    let artH, artW;
    if (this.stageWidth / this.stageHeight > ratio.w / ratio.h) {
      // by height
      artH = this.stageHeight * 0.7;
      artW = artH * (ratio.w / ratio.h);
    } else {
      // by width
      artW = this.stageWidth * 0.8;
      artH = artW * (ratio.h / ratio.w);
    }
    this.setState({
      artH,
      artW,
    });
  };

  setPage = (currentPage) => {
    console.log("setPage", currentPage);
    let isScreenOn = false;
    if (currentPage === PAGES.PSYCH) {
      isScreenOn = true;
    }

    this.setState({
      currentPage,
      isScreenOn,
    });
  };

  toggleArticle = (isArticleOn) => {
    console.log("toggle Article", isArticleOn);
    this.setState({
      isArticleOn,
    });
  };

  render() {
    let { currentPage, isScreenOn, isArticleOn, artH, artW } = this.state;

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
            style={{ width: artW, height: artH }}
            className={styles.ArticleContainer}
          >
            <ArticlePsychometric />
          </div>
        )}
      </div>
    );
  }
}
