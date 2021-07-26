import React, { memo, useCallback } from "react";
import { connect } from "react-redux";
import {
  setFaviorateList,
  deleteFavoriteList,
} from "../../../../store/actions";

const FavoriteButton = (props) => {
  const getFavoriteIcon = useCallback(() => {
    return _isFavoriate() ? "icon-favorite" : "icon-not-favorite";
  }, [props.favoriteList.length, props.song.id]);

  const toggleFavoriate = useCallback(
    (e) => {
      e.stopPropagation();
      if (_isFavoriate()) {
        props.dispatch(deleteFavoriteList(props.song));
      } else {
        props.dispatch(setFaviorateList(props.song));
      }
    },
    [props.favoriteList.length, props.song.id]
  );

  const _isFavoriate = useCallback(() => {
    const index = props.favoriteList.findIndex((item) => {
      return item.id === props.song.id;
    });
    return index > -1;
  }, [props.favoriteList.length, props.song.id]);

  return (
    <>
      <div className={props.className} onClick={(e) => toggleFavoriate(e)}>
        <i className={`icon ${getFavoriteIcon()}`}></i>
      </div>
    </>
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
)(memo(FavoriteButton));
