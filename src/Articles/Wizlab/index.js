import React, { Component } from "react";
import styles from "./index.module.css";
import { TransitionGroup } from "react-transition-group";
import { CSSTransitionWrapper } from "../../Component/Transition";

export default class Wizlab extends Component {
  state = {
    sectionIndex: 0,
  };

  addSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex + 1 }));
  };
  subtractSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex - 1 }));
  };

  render() {
    let { sectionIndex } = this.state;

    return (
      <div className={styles.body}>
        <div className={styles.inner}>
          <TransitionGroup component={null}>
            {sectionIndex >= 0 && (
              <CSSTransitionWrapper
                key={0}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={() => {}}
                wrapClassName={styles.secTitle}
              >
                <h2 className={styles.title}>WIZLAB</h2>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 1 && (
              <CSSTransitionWrapper
                key={1}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>영상</p>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 2 && (
              <CSSTransitionWrapper
                key={2}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>
                  저는 2018년 6월부터 2019년 7월까지
                  <br />
                  <b>위즈스쿨</b>이라는 스타트업에서
                  <br />
                  프로그래밍 교육 플랫폼을 기획/개발했습니다.
                </p>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 3 && (
              <CSSTransitionWrapper
                key={3}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>
                  <b>누구든 쉽게 상상을 구현할 수 있는 공간</b>을
                  <br />
                  목표로 무척 몰입하여 작업했던 프로젝트입니다!
                </p>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 4 && (
              <CSSTransitionWrapper
                key={4}
                appear={true}
                // onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>링크</p>
              </CSSTransitionWrapper>
            )}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}
