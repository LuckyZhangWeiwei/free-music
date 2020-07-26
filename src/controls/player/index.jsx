import React, {memo, useState, useEffect, useRef, useCallback, useMemo} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import animations from 'create-keyframe-animation'

import { setFullScreen } from '../../store/actions'
import { prefixStyle } from '../../common/js/dom'
import { getSongUrl } from '../../common/js/models/song'
import { setPlayingState, setCurrentIndex } from '../../store/actions'

import './index.stylus'
import './index.css'

const transform = prefixStyle('transform')

const Player = function(props) {
	const [show, setShow] = useState(false)

	const [currentSong, setCurrentSong] = useState(props.currentSong)

	const [songReady, setSongReady] = useState(false)

	const [currentTime, setCurrentTime] = useState(0)

	const cdWrapperRef = useRef()

	const audioRef = useRef()

	useEffect(() => {
		setShow(true)
	}, [])

	useEffect(() => {
		setShow(props.isFullScreen)
	}, [props.isFullScreen])

	useEffect(() => {
		getSongUrl(props.currentSong.name || props.currentSong.songname)
		.then(songUrl => {
			const song = {
				...props.currentSong,
				url: songUrl
			}
			setCurrentSong(song)
			setTimeout(() => {
				audioRef.current.play()
			}, 20);
		})
	}, [props.currentSong.name, props.currentSong.url])

	useEffect(() => {
		const audio = audioRef.current
		 setTimeout(() => {
			props.playingState ? audio.play() : audio.pause()	 
		 }, 20);
		 
	}, [props.playingState])

	useEffect(() => {
		if (!props.playingState) {
			props.dispatch(setPlayingState(true))
		}
	}, [props.currentIndex])

	const close = useCallback(function() {
		props.dispatch(setFullScreen(false))
		setShow(false)
	}, [props.isFullScreen]) 

	const open = useCallback(function() {
		props.dispatch(setFullScreen(true))
		setShow(true)
	}, [props.isFullScreen])

	const playIcon = useMemo(() => {
		return songReady && props.playingState ? 'icon-pause' : 'icon-play'
	}, [props.playingState, songReady])

	const playMniIcon = useMemo(() => {
		return props.playingState ? 'icon-pause-mini' : 'icon-play-mini'
	}, [props.playingState])

	const onEnter = useCallback(function (el) {
			const {x, y, scale} = _getPosAndScale
			let anim = {
			0: {
						transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
					},
				50: {
					transform: `translate3d(${x / 2}px, ${y / 2}px, 0) scale(0.5)`
				},
				100: {
					transform: 'translate3d(0, 0, 0) scale(1)'
				}
			}
			animations.registerAnimation({
				name: 'move',
				animation: anim,
				presets: {
					duration: 200,
					easing: 'linear',
				}
			})
	}, [])

	const onEntering = useCallback(function (el) {
		animations.runAnimation(cdWrapperRef.current, 'move', null)
	}, [])

	const onEntered = useCallback(function (el) {
		animations.unregisterAnimation('move')
		cdWrapperRef.current.style.animation = ''
	}, [])

	const onExit = function(el) {}

	const onExiting = useCallback(function(el) {
		cdWrapperRef.current.style.transition = 'all 0.2s'
    const {x, y, scale} = _getPosAndScale
    cdWrapperRef.current.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperRef.current.addEventListener('transitionend', null)
	}, [])

	const onExited = useCallback(function(el) {
		cdWrapperRef.current.style.transition = ''
    cdWrapperRef.current.style[transform] = ''
	}, [])

	const _getPosAndScale = useMemo(() => {
		const targetWidth = 40
		const paddingLeft = 40
		const paddingBottom = 30
		const paddingTop = 80
		const width = window.innerWidth * 0.8
		const scale = targetWidth / width
		const x = -(window.innerWidth / 2 - paddingLeft)
		const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
		return {
			x, y, scale
		}
	}, [])

	const togglePlaying = useCallback(() => {
		if (!songReady) {
			return
		 }
		 props.dispatch(setPlayingState(!props.playingState))
	}, [props.playingState, props.currentIndex, songReady])

	const cdCls = useMemo(() => {
		return props.playingState ? 'play' : 'play pause'
	}, [props.playingState])

	const disableCls = useMemo(() => {
		return songReady ? '' : 'disable'
	}, [songReady])

	const formatTime = useCallback(time => {
	  let	interval = time | 0
		const minute = interval / 60 | 0
		const second = _pad(interval % 60)
		return `${minute}:${second}`
	}, [])

	const _pad = useCallback ((num, n=2) => {
		let len = num.toString().length
		while(len < n) {
			num = '0' + num
			len ++
		}
		return num
	}, [])



	const next = useCallback(function() {
		if (!songReady) {
			return
		}
		let index = props.currentIndex + 1
		if (index === props.playList.length) {
			index = 0
		}
	  props.dispatch(setCurrentIndex(index))
		setSongReady(false)
	}, [props.currentIndex, songReady])

	const prev = useCallback(function() {
		if (!songReady) {
			return
		}
		let index = props.currentIndex - 1
		if (index < 0) {
			index = props.playList.length - 1
		}
		props.dispatch(setCurrentIndex(index))
		setSongReady(false)
	}, [props.currentIndex, songReady])

	const ready = useCallback(() => {
		setSongReady(true)
	}, [songReady])

	const error = useCallback(() => {
		setSongReady(true)
	}, [songReady])

	const updateTime = useCallback((e) => {
		let currentTime = e.target.currentTime
		setCurrentTime(currentTime)
	}, [])

	return (
		<div className="player">
			<CSSTransition 
				timeout={400} 
				in={show} 
				classNames="normal"
				onEnter={() => onEnter()}
				onEntering={() => onEntering()}
				onEntered={() => onEntered()}
				onExit={() => onExit()}
				onExiting={() => onExiting()}
				onExited={() => onExited()}
				>
				<div className="normal-player">
					<div className="background">
						<img width="100%" height="100%" src={currentSong.image} />
					</div>
					<div className="top">
						<div className="back" onClick={() => close()}>
							<i className="icon-back"></i>
						</div>
						<h1 className="title">{currentSong.name}</h1>
						<h2 className="subtitle">{currentSong.singer}</h2>
					</div>
					<div className="middle">
						<div className="middle-l">
							<div className="cd-wrapper" ref={cdWrapperRef}>
								<div className={`cd ${cdCls}`}>
									<img className="image" src={currentSong.image} />
								</div>
							</div>
						</div>
					</div>
					<div className="bottom">
						<div className="progress-wrapper">
							<span className="time time-l">{formatTime(currentTime)}</span>
							<div className="progress-bar-wrapper"></div>
							<span className="time time-r">{formatTime(currentSong.duration)}</span>
						</div>
						<div className="operators">
							<div className="icon i-left">
								<i className="icon-sequence"></i>
							</div>
							<div className={`icon i-left ${disableCls}`}>
								<i className="icon-prev" onClick={() => prev()}></i>
							</div>
							<div className={`icon i-center ${disableCls}`}>
								<i className={ playIcon } onClick={() => { togglePlaying() }}></i>
							</div>
							<div className={`icon i-right ${disableCls}`}>
								<i className="icon-next" onClick={() => { next()}}></i>
							</div>
							<div className="icon i-right">
								<i className="icon icon-not-favorite"></i>
							</div>
						</div>
					</div>
				</div>
			</CSSTransition>
			<CSSTransition timeout={200} in={!show} classNames="mini">
				<div className="mini-player" onClick={() => open()}>
					<div className="icon">
						<img width="40" height="40" src={currentSong.image} className={cdCls} />
					</div>
					<div className="text">
						<h2 className="name">{currentSong.name}</h2>
						<p className="desc">{currentSong.singer}</p>
					</div>
					<div className="control" onClick={e => {e.stopPropagation(); togglePlaying() }}><i className={playMniIcon}></i></div>
					<div className="control">
						<i className="icon-playlist"></i>
					</div>
				</div>
			</CSSTransition>
			<audio 
				src={currentSong.url} 
				ref={audioRef} 
				onCanPlay={() => ready()} 
				onError={() => error()}
				onTimeUpdate={e => updateTime(e)}
			/>
		</div>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(Player))