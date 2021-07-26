import React, { memo, useCallback, forwardRef } from "react";
import Scroll from "../../scroll";
import SearchList from "../../../controls/search-list";

const HistorySearchList = (props) => {
  const onItemClick = useCallback((item) => {
    props.onClickItem(item);
  }, []);
  const onIconClick = useCallback((item) => {
    props.onClickIcon(item);
  }, []);
  return (
    <Scroll
      className="list-scroll"
      data={props.searchHistory}
      ref={props.myRef}
    >
      <div className="list-inner">
        <SearchList
          itemClick={(item) => onItemClick(item)}
          iconClick={(item) => onIconClick(item)}
        />
      </div>
    </Scroll>
  );
};

export default memo(
  forwardRef((props, ref) => {
    return <HistorySearchList {...props} myRef={ref} />;
  })
);
