import React, { memo } from "react";
import { connect } from "react-redux";
import ProgressCircle from "./../../progress-circle";

const MiniPlayer = (props) => {
  return (
    <div className="mini-player" onClick={() => props.open()}>
      <div className="icon">
        <img
          width="40"
          height="40"
          src={props.currentSong.image}
          className={props.cdCls}
          alt=""
        />
      </div>
      <div className="text">
        <h2 className="name">{props.currentSong.name}</h2>
        <p className="desc">{props.currentSong.singer}</p>
      </div>
      <div
        className="control"
        onClick={(e) => {
          e.stopPropagation();
          props.togglePlaying();
        }}
      >
        <ProgressCircle radius={32} percentage={props.percentage}>
          <i className={`icon-mini ${props.playMniIcon}`} />
        </ProgressCircle>
      </div>
      <div
        className="control"
        onClick={(e) => {
          e.stopPropagation();
          props.setShowPlayList(!props.showPlayList);
        }}
      >
        <i className="icon-playlist" />
      </div>
    </div>
  );
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
)(memo(MiniPlayer));
