import React, {memo, useRef, useEffect} from 'react'
import Scroll from '../scroll'
import SongList from '../../controls/song-list'
import Loading from '../../controls/loading'

import './index.stylus'

const MusicList = function (props) {
	const scrollRef = useRef()
	const bgImageRef = useRef()
	
	useEffect(() => {
	 const scrollDom = scrollRef.current.wrapperRef.current
	 scrollDom.style.top = `${bgImageRef.current.clientHeight}px`
	}, [])

	return (
		<div className="music-list">
			<div className="back" onClick={() => {props.history.goBack()}}>
				<i className="icon-back"></i>
			</div>
			<h1 className="title">{props.title}</h1>
			<div className="bg-image" style={{backgroundImage: `url(${props.bgImage})`}} ref={bgImageRef}>
				<div className="filter"></div>
			</div>
			<Scroll className="list" data={props.song} ref={scrollRef}>
				<div className="song-list-wrapper">
					<SongList songs={props.song} />
				</div>
				{
					!props.song.length
					&&
					<div className="loading-container">
						<Loading title="正在加载..." />
					</div>
				}
			</Scroll>
		</div>
	)
}

export default memo(MusicList)