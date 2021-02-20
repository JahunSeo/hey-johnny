import React, { Component } from "react";
import { PAGES } from "../../Constant";

import styles from "./index.module.css";
// import classNames from "classnames/bind";
// const cx = classNames.bind(styles);

export default class Menu extends Component {
  render() {
    // todo: 선택 시 사라지는 애니메이션 실행 후 화면 전환
    // 게임 만들 때 쓰던 것 활용
    // 페이지가 메인이 아닐 때는, 돌아가기 버튼만 제시
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
        <div
          className={styles.btn}
          onClick={() => this.props.setPage(PAGES.QUIZ)}
        >
          퀴즈
        </div>
      </div>
    );
  }
}
