import React, { memo, useEffect, useRef, useCallback } from "react";
import { prefixStyle } from "../../common/js/dom";
import PropTypes from "prop-types";

import "./index.stylus";

const ProgressBar = (props) => {
  const progressBarRef = useRef();
  const progressRef = useRef();
  const progressBtnRef = useRef();

  const touchRef = useRef({});

  const transform = prefixStyle("transform");

  useEffect(() => {
    if (props.percent >= 0 && !touchRef.current.initiated) {
      const barWidth = progressBarRef.current.clientWidth - 16; // 减去按钮的宽度
      const offsetWidth = props.percent * barWidth;
      _offset(offsetWidth);
    }
  }, [props.percent]);

  const progressTouchStart = useCallback(function (e) {
    e.stopPropagation();

    touchRef.current.initiated = true;
    touchRef.current.startX = e.touches[0].pageX;
    touchRef.current.left = progressRef.current.clientWidth;
  }, []);

  const progressTouchMove = useCallback((e) => {
    e.stopPropagation();

    if (!touchRef.current.initiated) {
      return;
    }
    const barWidth = progressBarRef.current.clientWidth - 16;
    const deltaX = e.touches[0].pageX - touchRef.current.startX;
    const offsetWidth = Math.min(
      Math.max(0, touchRef.current.left + deltaX),
      barWidth
    );
    _offset(offsetWidth);

    const percentage =
      progressRef.current.clientWidth /
      (progressBarRef.current.clientWidth - 16);
    props.percentageChanged(percentage, true);
  }, []);

  const progressTouchEnd = useCallback((e) => {
    e.stopPropagation();
    touchRef.current.initiated = false;
    const percentage =
      progressRef.current.clientWidth /
      (progressBarRef.current.clientWidth - 16);
    props.percentageChanged(percentage, false);
  }, []);

  const _offset = useCallback((offsetWidth) => {
    progressRef.current.style.width = `${offsetWidth}px`;
    progressBtnRef.current.style[
      transform
    ] = `translate3d(${offsetWidth}px, 0 , 0)`;
  }, []);

  /**
   * react no e.offsetX
   *
   */
  // const progressClick = useCallback(e => {
  // 	e.stopPropagation()
  // 	_offset(e.offsetX)
  // 	const percentage = progressRef.current.clientWidth / (progressBarRef.current.clientWidth - 16)
  // 	props.percentageChanged(percentage)
  // }, [])

  return (
    <div className="progress-bar" ref={progressBarRef}>
      <div className="bar-inner">
        <div className="progress" ref={progressRef}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtnRef}
          onTouchStart={(e) => progressTouchStart(e)}
          onTouchMove={(e) => progressTouchMove(e, true)}
          onTouchEnd={(e) => progressTouchEnd(e, false)}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  percentageChanged: PropTypes.func.isRequired,
  percent: PropTypes.number.isRequired,
};

export default memo(ProgressBar);
