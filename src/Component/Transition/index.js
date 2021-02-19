import React from "react";
import { CSSTransition } from "react-transition-group";
import SectionTransition from "./SectionTransition.module.css";

// https://stackoverflow.com/questions/62187461/using-react-finddomnode-is-deprecated-in-strictmode-is-thrown-as-a-warning-when

export const CSSTransitionWrapper = ({ children, wrapClassName, ...props }) => {
  const nodeRef = React.useRef(null);
  let timeout = {
    enter: 700,
    exit: 300,
  };

  return (
    <CSSTransition
      nodeRef={nodeRef}
      timeout={timeout}
      classNames={SectionTransition}
      {...props}
    >
      <div ref={nodeRef} className={wrapClassName}>
        {children}
      </div>
    </CSSTransition>
  );
};