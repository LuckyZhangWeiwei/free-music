import React, {memo, useRef, useEffect, useCallback} from 'react'
import { connect } from 'react-redux'
import Scroll from '../scroll'
import SongList from '../../controls/song-list'
import Loading from '../../controls/loading'
import { prefixStyle } from '../../common/js/dom'
import { selectPlay, random } from '../../store/actions'

import './index.stylus'

const MusicList = props => {
	const scrollRef = useRef()
	const bgImageRef = useRef()
	const bgLayerRef = useRef()
	const minTranslateYRef = useRef()
	const imageHeightRef = useRef()
	const playWrapperRef = useRef()

	let minTranslateY
	let zIndex = 0
	let scale = 1
	const RESERVE_HEIGHT = 40

	const transform = prefixStyle('transform')
	
	useEffect(() => {
		const scrollDom = scrollRef.current.wrapperRef.current
		imageHeightRef.current = bgImageRef.current.clientHeight
		minTranslateY = -imageHeightRef.current + RESERVE_HEIGHT
		minTranslateYRef.current = minTranslateY
		scrollDom.style.top = `${imageHeightRef.current}px`
		return () => {
			scrollRef.current.destroy()
		}
	}, [])
	
 const handleScrollY = useCallback(function (scrollY) {
	 	let translateY = Math.max(minTranslateYRef.current, scrollY)
		bgLayerRef.current.style[transform] = `translate3d(0, ${translateY}px, 0`
		if (scrollY < minTranslateYRef.current) {
			zIndex = 10
			bgImageRef.current.style.paddingTop = 0
			bgImageRef.current.style.height = `${RESERVE_HEIGHT}px`
			if (playWrapperRef.current) {
				playWrapperRef.current.style.display = "none"
			}
			bgImageRef.current.style.background = '#222'
		} else {
			bgImageRef.current.style.paddingTop = '70%'
			bgImageRef.current.style.height = 0
			zIndex = 0
			if (playWrapperRef.current) {
				playWrapperRef.current.style.display = "block"
			}
			bgImageRef.current.style.backgroundImage = `url(${props.bgImage})`
		}
		bgImageRef.current.style.zIndex = zIndex
		
		const percent = Math.abs(scrollY / imageHeightRef.current)
		if (scrollY > 0) {
			scale = 1 + percent
			zIndex = 10
		}
		bgImageRef.current.style['background-size'] = 'cover'
		bgImageRef.current.style[transform] = `scale(${scale})`
		bgImageRef.current.style.zIndex = zIndex
 }, [])

 	const selectItem = useCallback(function(item, index) {
		 props.dispatch(selectPlay(props.song, index))
	}, [props.song])

	const randomPlay = useCallback(() => {
		props.dispatch(random(props.sequenceList))
		props.dispatch(selectPlay(props.song, props.currentIndex + 1))
	}, [props.sequenceList])

	return (
		<div className="music-list">
			<div className="back" onClick={() => {props.history.goBack()}}>
				<i className="icon-back"></i>
			</div>
			<h1 className="title">{props.title}</h1>
			<div className="bg-image" style={{backgroundImage: `url(${props.bgImage})`}} ref={bgImageRef}>
				{
					props.song.length 
					&&
					<div className="play-wrapper" ref={playWrapperRef}>
						<div className="play" onClick={() => {randomPlay()}}>
							<i className="icon-play"></i>
							<span className="text">随机播放全部</span>
						</div>
					</div>
				}
				
				<div className="filter"></div>
			</div>
			<div className="bg-layer" ref={bgLayerRef}>
			</div>
			<Scroll 
				className="list"
				data={props.song}
				ref={scrollRef}
				probeType={3}
				listenScroll={true}
				scroll={scroll}>
				<div className="song-list-wrapper">
					<SongList songs={props.song} select={(item, index) => selectItem(item, index)} rank={props.rank}/>
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

	function scroll (pos) {
		handleScrollY(pos.y)
	}
}

export default connect(function mapStateToProps(state) {
	return {...state}
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(MusicList))
