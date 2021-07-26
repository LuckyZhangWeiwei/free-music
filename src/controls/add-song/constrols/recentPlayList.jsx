import React, { memo, forwardRef } from "react";
import Scroll from "../../scroll";
import SongList from "../../song-list";

const RecentPlayList = (props) => {
  return (
    <>
      <Scroll
        ref={props.myRef}
        className="list-scroll"
        data={props.playHistory}
      >
        <div className="list-inner">
          <SongList
            songs={props.playHistory}
            select={(song, index) => props.select(song, index)}
          />
        </div>
      </Scroll>
    </>
  );
};

export default memo(
  forwardRef((props, ref) => {
    return <RecentPlayList {...props} myRef={ref} />;
  })
);
