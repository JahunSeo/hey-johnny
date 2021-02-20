import React, { Component } from "react";
import styles from "./index.module.css";
import { TransitionGroup } from "react-transition-group";
import { CSSTransitionWrapper } from "../../Component/Transition";

import JobsImage from "../../Image/johnny_jobs.jpg";

export default class Quiz extends Component {
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
                <h2 className={styles.title}>JOHNNY QUIZ</h2>
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
                <img className={styles.image} src={JobsImage} alt="jobs" />
                <p className={styles.imageDesc}>
                  (주의! 당신의 눈은 소중합니다!)
                </p>
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
                  저는 2019년 8월부터 현재까지
                  <br />
                  판교의 마이다스아이티라는 회사에서
                  <br />
                  <b>'AI역량검사'</b>를 기획/개발하고 있습니다.
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
                  AI역량검사는 <b>뇌신경과학 기반으로</b>
                  <br />
                  <b>개인의 역량을 측정하는 인재선발도구</b> 입니다.
                </p>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 4 && (
              <CSSTransitionWrapper
                key={4}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>
                  새로운 측정 도구를 기획하고 개발하는 일은
                  <br />
                  무척 도전적이고 흥미로운 과제입니다!
                </p>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 5 && (
              <CSSTransitionWrapper
                key={5}
                appear={true}
                // onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={styles.secDesc}
              >
                <p className={styles.desc}>
                  그런 의미에서...
                  <br />
                  '쟈니 퀴즈'에 도전해보실래요?
                </p>
                <div className={styles.btnRow}>
                  <div
                    className={styles.playBtn}
                    onClick={this.subtractSectionIndex}
                  >
                    시작하기
                  </div>
                </div>
              </CSSTransitionWrapper>
            )}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}
