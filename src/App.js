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
    let { scrW, scrH } = this.getScreenSize(this.state.currentPage);
    this.setState({
      scrH,
      scrW,
    });
  };

  getScreenSize = (currentPage) => {
    console.log("getScreenSize", currentPage);
    let screenSize = SCREEN_SIZE.HORI32;
    if (currentPage === PAGES.QUIZ) {
      screenSize = SCREEN_SIZE.HORI32;
    }
    let ratio = screenSize.ratio;
    let scrH, scrW;
    if (this.stageWidth / this.stageHeight > ratio.w / ratio.h) {
      // by height
      scrH = this.stageHeight * 0.7;
      scrH = Math.min(scrH, screenSize.max.h);
      scrW = scrH * (ratio.w / ratio.h);
    } else {
      // by width
      scrW = this.stageWidth * 0.8;
      scrW = Math.min(scrW, screenSize.max.w);
      scrH = scrW * (ratio.h / ratio.w);
    }

    return { scrW, scrH };
  };

  setPage = (currentPage) => {
    console.log("setPage", currentPage);
    if (currentPage === PAGES.QUIZ) {
      let { scrW, scrH } = this.getScreenSize(currentPage);
      this.setState({
        currentPage,
        isScreenOn: true,
        scrW,
        scrH,
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
