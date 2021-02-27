import React, { useState, useEffect, useRef } from "react";
import { PAGES } from "../../Constant";
import { TransitionGroup } from "react-transition-group";
import { CSSTransitionWrapper, SlowCSSTransitionWrapper } from "../Transition";

import styles from "./index.module.css";

function usePrevious(value) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Navigation(props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isBackBtnOn, setIsBackBtnOn] = useState(false);
  const currPage = props.currentPage;
  const prevPage = usePrevious(currPage);
  const setPage = props.setPage;

  useEffect(() => {
    if (prevPage !== currPage) {
      if (currPage !== PAGES.MAIN) {
        setSectionIndex(0);
      }
    }
  }, [prevPage, currPage]);

  useEffect(() => {
    if (isBackBtnOn === false) {
      setPage(PAGES.MAIN);
    }
  }, [isBackBtnOn, setPage]);

  return (
    <nav className={styles.body}>
      <TransitionGroup component={null}>
        {sectionIndex >= 0 && (
          <SlowCSSTransitionWrapper
            key={0}
            appear={true}
            onEntered={() => setSectionIndex(1)}
            onExited={() => setIsBackBtnOn(true)}
            wrapClassName={styles.secText}
          >
            <p className={styles.greeting}>안녕하세요!</p>
          </SlowCSSTransitionWrapper>
        )}
        {sectionIndex >= 1 && (
          <CSSTransitionWrapper
            key={1}
            appear={true}
            // onEntered={() => {}}
            onExited={() => setSectionIndex(-1)}
            wrapClassName={styles.secText}
          >
            <p className={styles.guide}>아래 위성 중 하나를 선택해주세요.</p>
          </CSSTransitionWrapper>
        )}
        {isBackBtnOn && (
          <SlowCSSTransitionWrapper
            key={2}
            appear={true}
            onExited={() => setSectionIndex(0)}
            wrapClassName={styles.secText}
          >
            <div
              className={styles.btn}
              onClick={() => setIsBackBtnOn(false)}
            ></div>
          </SlowCSSTransitionWrapper>
        )}
      </TransitionGroup>
    </nav>
  );
}
