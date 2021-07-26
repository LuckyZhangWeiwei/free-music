import React, { memo } from "react";
import Scroll from "./../scroll";
import SongList from "./../song-list";

const ScrollList = (props) => {
  return (
    <Scroll ref={props.myRef} className="list-scroll" data={props.playHistory}>
      <div className="list-inner">
        <SongList
          songs={props.data}
          select={(song, index) => props.select(song, index)}
        />
      </div>
    </Scroll>
  );
};

export default memo(ScrollList);
