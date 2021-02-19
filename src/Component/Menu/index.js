import React, { Component } from "react";
import { PAGES } from "../../App";

import styles from "./index.module.css";
// import classNames from "classnames/bind";
// const cx = classNames.bind(styles);

export default class Menu extends Component {
  render() {
    return (
      <div className={styles.body}>
        <div
          className={styles.btn}
          onClick={() => this.props.setPage(PAGES.MAIN)}
        >
          메인
        </div>
        <div
          className={styles.btn}
          onClick={() => this.props.setPage(PAGES.CANDY)}
        >
          별사탕
        </div>
      </div>
    );
  }
}
