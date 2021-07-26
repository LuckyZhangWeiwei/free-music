import React, { memo, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

import "./index.stylus";

const TopTip = (props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <CSSTransition timeout={500} classNames="drop" in={show}>
      <div className="top-tip">{props.children}</div>
    </CSSTransition>
  );
};

export default memo(TopTip);
