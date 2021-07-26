import React, { memo } from "react";
import PropTypes from "prop-types";

import "./index.stylus";

const NoResult = function (props) {
  return (
    <div className="no-result">
      <div className="no-result-icon"></div>
      <p className="no-result-text">{props.title}</p>
    </div>
  );
};

NoResult.propTypes = {
  title: PropTypes.string.isRequired,
};

export default memo(NoResult);
