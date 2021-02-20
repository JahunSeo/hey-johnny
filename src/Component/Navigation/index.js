import React, { Component } from "react";
import { PAGES } from "../../Constant";
import { TransitionGroup } from "react-transition-group";
import { CSSTransitionWrapper, SlowCSSTransitionWrapper } from "../Transition";

import styles from "./index.module.css";
// import classNames from "classnames/bind";
// const cx = classNames.bind(styles);

export default class Navigation extends Component {
  state = {
    sectionIndex: 0,
    isBackBtnOn: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage !== this.props.currentPage) {
      if (this.props.currentPage !== PAGES.MAIN) {
        this.subtractSectionIndex();
      }
    }
  }

  addSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex + 1 }));
  };
  subtractSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex - 1 }));
  };

  showBackBtn = () => {
    this.setState({
      isBackBtnOn: true,
    });
  };

  handleBackBtn = () => {
    this.props.setPage(PAGES.MAIN);
    this.setState((state) => ({
      isBackBtnOn: false,
    }));
  };

  render() {
    let { sectionIndex, isBackBtnOn } = this.state;

    return (
      <nav className={styles.body}>
        <TransitionGroup component={null}>
          {sectionIndex >= 0 && (
            <SlowCSSTransitionWrapper
              key={0}
              appear={true}
              onEntered={this.addSectionIndex}
              onExited={this.showBackBtn}
              wrapClassName={styles.secText}
            >
              <p className={styles.greeting}>안녕하세요!</p>
            </SlowCSSTransitionWrapper>
          )}
          {sectionIndex >= 1 && (
            <CSSTransitionWrapper
              key={1}
              appear={true}
              // onEntered={this.addSectionIndex}
              onExited={this.subtractSectionIndex}
              wrapClassName={styles.secText}
            >
              <p className={styles.guide}>아래 위성 중 하나를 선택해주세요.</p>
            </CSSTransitionWrapper>
          )}
          {isBackBtnOn && (
            <SlowCSSTransitionWrapper
              key={2}
              appear={true}
              onExited={this.addSectionIndex}
              wrapClassName={styles.secText}
            >
              <div className={styles.btn} onClick={this.handleBackBtn}></div>
            </SlowCSSTransitionWrapper>
          )}
        </TransitionGroup>
      </nav>
    );
  }
}
