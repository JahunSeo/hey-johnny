import React, { Component } from "react";
import { PAGES } from "../Constant";
import { TransitionGroup } from "react-transition-group";
import {
  CSSTransitionWrapper,
  SlowCSSTransitionWrapper,
} from "../../Component/Transition";

import styles from "./index.module.css";

export default class Navigation extends Component {
  state = {
    sectionIndex: -1,
    isGuideOn: false,
    isBackBtnOn: false,
  };

  componentDidMount() {
    if (this.props.currentPage === PAGES.MAIN) {
      this.startGuide();
    } else {
      this.startBackBtn();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage !== this.props.currentPage) {
      if (this.props.currentPage === PAGES.MAIN) {
        this.setState({ isBackBtnOn: false });
      } else {
        this.setState({ isGuideOn: false });
      }
    }
  }

  startGuide = () => {
    this.setState({
      isGuideOn: true,
      // isBackBtnOn: false,
      sectionIndex: 0,
    });
  };

  startBackBtn = () => {
    this.setState({
      // isGuideOn: false,
      isBackBtnOn: true,
      sectionIndex: -1,
    });
  };

  addSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex + 1 }));
  };
  subtractSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex - 1 }));
  };

  handleBackBtn = () => {
    this.props.setPage(PAGES.MAIN);
  };

  render() {
    let { isBackBtnOn, isGuideOn, sectionIndex } = this.state;
    // console.log(this.state);

    return (
      <nav className={styles.body}>
        <TransitionGroup component={null}>
          {isGuideOn && sectionIndex >= 0 && (
            <SlowCSSTransitionWrapper
              key={0}
              appear={true}
              onEntered={this.addSectionIndex}
              onExited={this.startBackBtn}
              wrapClassName={styles.secText}
            >
              <p className={styles.greeting}>안녕하세요!</p>
            </SlowCSSTransitionWrapper>
          )}
          {isGuideOn && sectionIndex >= 1 && (
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
              onExited={this.startGuide}
              wrapClassName={styles.secText}
            >
              <div className={styles.btn} onClick={this.handleBackBtn} />
            </SlowCSSTransitionWrapper>
          )}
        </TransitionGroup>
      </nav>
    );
  }
}
