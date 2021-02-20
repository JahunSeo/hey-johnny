import React, { Component } from "react";
import styles from "./index.module.css";
import { TransitionGroup } from "react-transition-group";
import { CSSTransitionWrapper } from "../../Component/Transition";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default class Wizlab extends Component {
  constructor(props) {
    super(props);
    this.videoRef = null;
    this.setVideoRef = (element) => {
      if (!element) return;
      this.videoRef = element;
      //   this.videoRef.addEventListener("ended", this.handleVideoEnded);
      //   this.videoRef.addEventListener("play", this.handleVideoPlay);
    };
    this.state = {
      sectionIndex: 0,
      isVideoMuted: false,
      isVideoZoom: false,
    };
  }

  componentWillUnmount() {
    // this.videoRef.removeEventListener("ended", this.handleVideoEnded);
    // this.videoRef.removeEventListener("play", this.handleVideoPlay);
  }

  addSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex + 1 }));
  };
  subtractSectionIndex = () => {
    this.setState(({ sectionIndex }) => ({ sectionIndex: sectionIndex - 1 }));
  };

  toggleVideoZoom = () => {
    this.setState((state) => ({
      isVideoZoom: !state.isVideoZoom,
    }));
  };

  toggleVideoMuted = () => {
    this.setState((state) => ({
      isVideoMuted: !state.isVideoMuted,
    }));
  };

  render() {
    let { sectionIndex, isVideoMuted, isVideoZoom } = this.state;

    let videoUrl = "../video/johnny_wizlab_demo.mp4";

    return (
      <div className={styles.body}>
        <div className={cx("inner", { "inner--blockScroll": isVideoZoom })}>
          <TransitionGroup component={null}>
            {sectionIndex >= 0 && (
              <CSSTransitionWrapper
                key={0}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={() => {}}
                wrapClassName={styles.secTitle}
              >
                <h2 className={styles.title}>DEVELOPER</h2>
              </CSSTransitionWrapper>
            )}
            {sectionIndex >= 1 && (
              <CSSTransitionWrapper
                key={1}
                appear={true}
                onEntered={this.addSectionIndex}
                onExited={this.subtractSectionIndex}
                wrapClassName={cx("secVideo", {
                  "secVideo--zoom": isVideoZoom,
                })}
              >
                <video
                  className={styles.video}
                  ref={this.setVideoRef}
                  controls
                  playsInline
                  autoPlay={true}
                  muted={isVideoMuted}
                  controlsList="nodownload"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                >
                  <source src={videoUrl} />
                </video>
                <div className={cx("btnRow", { "btnRow--float": isVideoZoom })}>
                  <div
                    className={cx("videoBtn", {
                      "videoBtn--off": isVideoZoom,
                      "videoBtn--on": !isVideoZoom,
                    })}
                    onClick={this.toggleVideoZoom}
                  >
                    {isVideoZoom ? "작게 보기" : "크게 보기"}
                  </div>
                  <div
                    className={cx("videoBtn", {
                      "videoBtn--on": isVideoMuted,
                      "videoBtn--off": !isVideoMuted,
                    })}
                    onClick={this.toggleVideoMuted}
                  >
                    {isVideoMuted ? "소리 켜기" : "소리 끄기"}
                  </div>
                </div>
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
          </TransitionGroup>
        </div>
      </div>
    );
  }
}
