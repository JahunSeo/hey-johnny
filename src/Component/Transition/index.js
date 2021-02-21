import React from "react";
import { CSSTransition } from "react-transition-group";
import SectionTransition from "./SectionTransition.module.css";
import SlowTransition from "./SlowTransition.module.css";
import QuoteTransition from "./QuoteTransition.module.css";

// https://stackoverflow.com/questions/62187461/using-react-finddomnode-is-deprecated-in-strictmode-is-thrown-as-a-warning-when

export const CSSTransitionWrapper = ({
  children,
  wrapClassName,
  classNames,
  timeout,
  ...props
}) => {
  const nodeRef = React.useRef(null);

  if (timeout === undefined) {
    timeout = {
      enter: 700,
      exit: 300,
    };
  }
  if (classNames === undefined) {
    classNames = SectionTransition;
  }

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

export const SlowCSSTransitionWrapper = (props) => {
  return (
    <CSSTransitionWrapper
      timeout={{ enter: 1000, exit: 1000 }}
      classNames={SlowTransition}
      {...props}
    />
  );
};

export const QuoteCSSTransitionWrapper = (props) => {
  return (
    <CSSTransitionWrapper
      timeout={{ enter: 4000, exit: 1000 }}
      classNames={QuoteTransition}
      {...props}
    />
  );
};
