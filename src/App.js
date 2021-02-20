import React, { Component } from "react";

import Field from "./Field/Asteroid01";
import Menu from "./Component/Menu";

import ArticleQuiz from "./Articles/Quiz";
import styles from "./App.module.css";

export const PAGES = {
  MAIN: "PAGE_MAIN",
  CANDY: "PAGE_CANDY",
  QUIZ: "PAGE_QUIZ",
};

export const SCREEN_SIZE = {
  HORI32: { ratio: { w: 3, h: 2 }, max: { w: 840, h: 560 } }, // 3:2
  VERT169: { ratio: { w: 9, h: 16 }, max: { w: 360, h: 640 } }, // 9:16
};

export default class App extends Component {
  state = {
    currentPage: PAGES.MAIN,
    isScreenOn: false,
    isArticleOn: false,
  };

  // screenSize = {
  //   max: { w: 840, h: 560 },
  // };

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.resizeEventHandler();
    // // DEBUG // //
    this.setState({
      currentPage: PAGES.QUIZ,
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
    let screenSize = SCREEN_SIZE.HORI32; // TODO
    let ratio = screenSize.ratio;
    let artH, artW;
    if (this.stageWidth / this.stageHeight > ratio.w / ratio.h) {
      // by height
      artH = this.stageHeight * 0.7;
      artH = Math.min(artH, screenSize.max.h);
      artW = artH * (ratio.w / ratio.h);
    } else {
      // by width
      artW = this.stageWidth * 0.8;
      artW = Math.min(artW, screenSize.max.w);
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
    if (currentPage === PAGES.QUIZ) {
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
            // screenSize={this.screenSize}
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
            <ArticleQuiz />
          </div>
        )}
      </div>
    );
  }
}
