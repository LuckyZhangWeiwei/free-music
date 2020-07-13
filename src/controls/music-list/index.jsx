import React, {memo, useRef, useEffect, useState} from 'react'
import Scroll from '../scroll'
import SongList from '../../controls/song-list'
import Loading from '../../controls/loading'

import './index.stylus'

const MusicList = function (props) {
	const scrollRef = useRef()
	const bgImageRef = useRef()
	const bgLayerRef = useRef()
	const minTranslateYRef = useRef()
	const imageHeightRef = useRef()

	const [scrollY, setScrollY] = useState(0)
	let minTranslateY
	let zIndex = 0
	let scale = 1
	const RESERVE_HEIGHT = 40
	
	useEffect(() => {
		const scrollDom = scrollRef.current.wrapperRef.current
		imageHeightRef.current = bgImageRef.current.clientHeight
		minTranslateY = -imageHeightRef.current + RESERVE_HEIGHT
		minTranslateYRef.current = minTranslateY
		scrollDom.style.top = `${imageHeightRef.current}px`
	}, [])

	useEffect(() => {
		let translateY = Math.max(minTranslateYRef.current, scrollY)
		bgLayerRef.current.style['transform'] = `translate3d(0, ${translateY}px, 0`
		bgLayerRef.current.style['webkit-transform'] = `translate3d(0, ${translateY}px, 0`
		if (scrollY < minTranslateYRef.current) {
			zIndex = 10
			bgImageRef.current.style.paddingTop = 0
			bgImageRef.current.style.height = `${RESERVE_HEIGHT}px`
		} else {
				bgImageRef.current.style.paddingTop = '70%'
				bgImageRef.current.style.height = 0
				zIndex = 0 
		}
		bgImageRef.current.style.zIndex = zIndex
		
		const percent = Math.abs(scrollY / imageHeightRef.current)
		if (scrollY > 0) {
			scale = 1 + percent
			zIndex = 10
		}
		bgImageRef.current.style['transform'] = `scale(${scale})`
		bgImageRef.current.style['webkit-transform'] = `scale(${scale})`
		bgImageRef.current.style.zIndex = zIndex
	}, [scrollY])

	return (
		<div className="music-list">
			<div className="back" onClick={() => {props.history.goBack()}}>
				<i className="icon-back"></i>
			</div>
			<h1 className="title">{props.title}</h1>
			<div className="bg-image" style={{backgroundImage: `url(${props.bgImage})`}} ref={bgImageRef}>
				<div className="filter"></div>
			</div>
			<div className="bg-layer" ref={bgLayerRef}>

			</div>
			<Scroll className="list" data={props.song} ref={scrollRef} probeType={3} listenScroll={true} scroll={scroll}>
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

	function scroll (pos) {
		setScrollY(pos.y)
	}
}

export default memo(MusicList)