import React, { memo, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { playMode } from "../../common/js/config";
import { setPlayList, setPlayMode } from "../../store/actions";
import { shuffle } from "../../common/js/util";

const PlayMode = memo((props) => {
  const iconMode = useMemo(() => {
    return props.playMode === playMode.sequence
      ? "icon-sequence"
      : props.playMode === playMode.loop
      ? "icon-loop"
      : "icon-random";
  }, [props.playMode]);

  const changePlayMode = useCallback(() => {
    const mode = (props.playMode + 1) % 3;
    props.dispatch(setPlayMode(mode));
    let tempList = {};
    Object.assign(tempList, props.sequenceList);
    let array = Object.values(tempList);
    let list = null;
    if (mode === playMode.random) {
      list = shuffle(array);
    } else {
      list = array;
    }
    props.dispatch(setPlayList(list));
  }, [props.playMode, props.currentIndex]);

  return (
    <div
      className="icon i-left"
      onClick={(e) => {
        changePlayMode(e);
      }}
    >
      <i className={iconMode}></i>
    </div>
  );
});

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    };
  }
)(memo(PlayMode));
