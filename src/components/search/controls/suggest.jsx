import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { search } from "../../../api/search";
import { ERR_OK_lOCAL } from "../../../api/config";
import { createSong2 } from "../../../common/js/models/song";
import Scroll from "../../../controls/scroll";
import NoResult from "../../../controls/no-result";
import Loading from "../../../controls/loading";
import Singer from "../../../common/js/models/singer";
import { setSinger, insertSong } from "../../../store/actions";

import "./suggest.stylus";

const TYPE_SINGER = "singer";
const PAGE_SIZE = 25;

const getIconCls = (item) => {
  if (item.type === TYPE_SINGER) {
    return "icon-mine";
  } else {
    return "icon-music";
  }
};

const getDisplayName = (item) => {
  if (item.type === TYPE_SINGER) {
    return item.singername;
  } else {
    return `${item.name} - ${item.singer}`;
  }
};

const SuggestItem = memo((props) => {
  const [selectedItem, setSelectedItem] = useState();

  const selectItem = useCallback(
    (item) => {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername,
        });

        const url = `${props.match.url + "/" + singer.id}`;

        props.history.push({
          pathname: url,
        });

        props.dispatch(setSinger(singer));
      } else {
        props.dispatch(insertSong(item));
      }
      props.select(item);
      setSelectedItem(item);
    },
    [selectedItem]
  );

  return (
    <li
      className="suggest-item"
      onClick={() => {
        selectItem(props.item);
      }}
    >
      <div className="icon">
        <i className={getIconCls(props.item)} />
      </div>
      <div className="name">
        <p className="text">{getDisplayName(props.item)}</p>
      </div>
    </li>
  );
});

SuggestItem.propTypes = {
  query: PropTypes.func,
};

const Suggest = (props) => {
  const [data, setData] = useState([]);

  const scrollRef = useRef();

  const pageRef = useRef(1);

  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!props.query) return;
    searchSong(true);
  }, [props.query]);

  useEffect(() => {
    if (!!props.suggestListRef.current) {
      if (props.currentSong && props.currentSong.id) {
        props.suggestListRef.current.style["margin-bottom"] = "60px";
      } else {
        props.suggestListRef.current.style["margin-bottom"] = "0px";
      }
    }
  }, [data, props.query, props.currentSong && props.currentSong.id]);

  const searchSong = useCallback(
    (isInit = true) => {
      setHasMore(true);
      search(props.query, pageRef.current, true, PAGE_SIZE).then((res) => {
        if (res.code === ERR_OK_lOCAL) {
          setHasMore(res.result.hasMore);
          const songs = res.result.songs;
          const list = _genResult(songs);
          setData(data.concat(list));
        }
      });
    },
    [data, props.query]
  );

  const _genResult = useCallback(
    (data) => {
      let ret = [];
      if (data) {
        const normalizedSongs = _normalizeSongs(data);
        ret = normalizedSongs;
      }
      return ret;
    },
    [data]
  );

  const _normalizeSongs = useCallback(
    (list) => {
      let ret = [];
      list.forEach((item) => {
        if (item.id) {
          ret.push(createSong2(item));
        }
      });
      return ret;
    },
    [data]
  );

  const onScrollToEnd = () => {
    searchMore();
  };

  const searchMore = () => {
    if (!hasMore) {
      return;
    }
    pageRef.current = pageRef.current + 1;
    searchSong(false);
  };

  const beforeScroll = () => {
    props.onScroll();
  };

  return (
    <Scroll
      className="suggest"
      data={data}
      ref={scrollRef}
      scrollToEnd={() => onScrollToEnd()}
      pullUp={true}
      beforeScroll={true}
      onBeforeScroll={() => beforeScroll()}
    >
      <ul className="suggest-list">
        {data.map((item, index) => {
          return <SuggestItem key={index} item={item} {...props} />;
        })}
        {hasMore && <Loading />}
      </ul>
      <div className="no-result-wrapper">
        {data.length === 0 && !hasMore && <NoResult title="暂无搜索结果" />}
      </div>
    </Scroll>
  );
};

Suggest.defaultProps = {
  showSinger: true,
};

Suggest.propTypes = {
  query: PropTypes.string.isRequired,
  showSinger: PropTypes.bool,
};

export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(memo(Suggest));
