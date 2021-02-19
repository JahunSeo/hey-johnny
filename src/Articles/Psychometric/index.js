import React, { Component } from "react";
import styles from "./index.module.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SectionTransition from "../../Component/Transition/SectionTransition.module.css";

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
    let timeout = {
      enter: 700,
      exit: 300,
    };

    return (
      <div className={styles.body}>
        <TransitionGroup>
          {sectionIndex >= 0 && (
            <CSSTransition
              key={0}
              timeout={timeout}
              classNames={SectionTransition}
              appear={true}
              onEntered={this.addSectionIndex}
              onExited={() => {}}
            >
              <section className={styles.secHead}>
                <h2 className={styles.title}>{"역량검사 개발"}</h2>
              </section>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    );
  }
}
