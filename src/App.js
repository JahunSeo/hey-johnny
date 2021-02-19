import React, { Component } from "react";

import CanvasAsteroid01 from "./Example/Asteroid01";
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
  };

  setPage = (currentPage) => {
    console.log("setPage", currentPage);
    this.setState({
      currentPage,
    });
  };

  render() {
    let { currentPage } = this.state;

    return (
      <div className={styles.body}>
        <Menu currentPage={currentPage} setPage={this.setPage} />
        <CanvasAsteroid01 />
      </div>
    );
  }
}
