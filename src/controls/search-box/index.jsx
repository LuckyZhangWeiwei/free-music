import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from "react";
import PropTypes from "prop-types";
import { debounce } from "../../common/js/util";

import "./index.stylus";

const SearchBox = (props) => {
  const [textValue, setTextValue] = useState(props.selectedHotKey || "");

  const timer = useRef();

  const textChange = useCallback(function (e) {
    setTextValue(e.target.value);
  }, []);

  const clearTextBox = useCallback(() => {
    setTextValue("");
  }, []);

  useEffect(() => {
    debounce(
      function () {
        props.searchChanged(textValue);
      },
      timer,
      500
    )();
  }, [textValue]);

  useEffect(() => {
    setTextValue(props.selectedHotKey);
  }, [props.selectedHotKey]);

  return (
    <div className="search-box">
      <i className="icon-search" />
      <input
        type="text"
        className="box"
        value={textValue}
        placeholder={props.placeholder}
        onChange={(e) => textChange(e)}
        ref={props.myRef}
      />
      {textValue && (
        <i className="icon-dismiss" onClick={() => clearTextBox()} />
      )}
    </div>
  );
};

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  searchChanged: PropTypes.func,
};

export default memo(
  forwardRef((props, ref) => {
    return <SearchBox {...props} myRef={ref} />;
  })
);
