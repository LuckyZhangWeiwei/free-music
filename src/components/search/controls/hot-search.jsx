import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setHotList } from "./../../../store/actions";
import { getHotSearchTag } from "../../../api/search";
import { ERR_OK_lOCAL } from "../../../api/config";
import Scroll from "../../../controls/scroll";

const HotSearch = (props) => {
  const [data, setData] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    setData(props.hot.concat(props.searchHistory));
    setTimeout(() => {
      !!scrollRef.current && scrollRef.current.refresh();
    }, 20);
  }, [props.hot, props.searchHistory]);

  useEffect(() => {
    if (props.hot.length === 0) {
      getHotSearchTag().then((res) => {
        if (res.code === ERR_OK_lOCAL) {
          props.dispatch(setHotList(res.result.hots));
        }
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      !!scrollRef.current && scrollRef.current.refresh();
    }, 20);
  }, [props.selectedHotKey]);

  const onHotKeyClicked = useCallback((item) => {
    props.hotKeyClicked(item);
  }, []);

  return (
    <Scroll className="shortcut" data={data} ref={scrollRef}>
      <div>
        <div className="hot-key">
          <h1 className="title">{props.title}</h1>
          <ul>
            {props.hot.map((item) => {
              return (
                <li
                  className="item"
                  key={item.first}
                  onClick={() => onHotKeyClicked(item)}
                >
                  {item.first}
                </li>
              );
            })}
          </ul>
        </div>
        {props.children}
      </div>
    </Scroll>
  );
};

HotSearch.propTypes = {
  title: PropTypes.string,
  hotKeyClicked: PropTypes.func.isRequired,
};

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    };
  }
)(memo(HotSearch));
