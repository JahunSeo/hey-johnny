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

  render() {
    let { currentPage, isScreenOn } = this.state;

    return (
      <div className={styles.body}>
        <Menu currentPage={currentPage} setPage={this.setPage} />
        <Field currentPage={currentPage} isScreenOn={isScreenOn} />
      </div>
    );
  }
}
