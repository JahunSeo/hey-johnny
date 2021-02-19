import React, { Component } from "react";
import styles from "./index.module.css";
import { TransitionGroup } from "react-transition-group";
import { CSSTransitionWrapper } from "../../Component/Transition";

export default class Psychometric extends Component {
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
        <TransitionGroup>
          {sectionIndex >= 0 && (
            <CSSTransitionWrapper
              key={0}
              appear={true}
              onEntered={this.addSectionIndex}
              onExited={() => {}}
            >
              <section className={styles.secHead}>
                <h2 className={styles.title}>{"역량검사 개발"}</h2>
              </section>
            </CSSTransitionWrapper>
          )}
        </TransitionGroup>
      </div>
    );
  }
}
