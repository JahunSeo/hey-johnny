import React from "react";
import { CSSTransition } from "react-transition-group";
import SectionTransition from "./SectionTransition.module.css";

export const CSSTransitionWrapper = ({ children, ...props }) => {
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
      <div ref={nodeRef}>{children}</div>
    </CSSTransition>
  );
};
