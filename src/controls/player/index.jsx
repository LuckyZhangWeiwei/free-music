import React, {memo, useState, useEffect, useRef, useCallback, useMemo} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import animations from 'create-keyframe-animation'

import { setFullScreen, setPlayList } from '../../store/actions'
import { prefixStyle } from '../../common/js/dom'
import { getSongUrl } from '../../common/js/models/song'
import { setPlayingState, setCurrentIndex, setPlayMode, setCurrentSong } from '../../store/actions'
import ProgressBar from './../progress-bar'
import ProgressCircle from './../progress-circle'
import { playMode } from '../../common/js/config'
import { shuffle } from '../../common/js/util'

import './index.stylus'
import './index.css'

const transform = prefixStyle('transform')

const Player = function(props) {
	const [show, setShow] = useState(false)

	const [songReady, setSongReady] = useState(false)

	const [currentTime, setCurrentTime] = useState(0)

	const [percentage, setPercentage] = useState(0)

	const cdWrapperRef = useRef()

	const audioRef = useRef()

	const playingStateRef = useRef(props.playingState)

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
		  props.dispatch(setCurrentSong(song))
			// setTimeout(() => {
			// 	audioRef.current.play()
			// }, 20);
			audioRef.current.play()
		})
	}, 
	[props.currentSong.id, props.currentSong.url])

	useEffect(() => {
		const audio = audioRef.current
		//  setTimeout(() => {
		// 	playingStateRef.current ? audio.play() : audio.pause()	 
		//  }, 20)
		playingStateRef.current ? audio.play() : audio.pause()	 
	}, [playingStateRef.current])

	useEffect(() => {
		if (!playingStateRef.current) {
			playingStateRef.current = true
			props.dispatch(setPlayingState(playingStateRef.current))
		}
	}, [props.currentSong.id])

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

	const togglePlaying = useCallback((e) => {
	  e && e.stopPropagation()
		playingStateRef.current = !playingStateRef.current
		props.dispatch(setPlayingState(playingStateRef.current))
	}, [])

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

	const next = useCallback(function(e) {
		if (!songReady) {
			return
		}
		let index = props.currentIndex + 1
		if (index === props.playList.length) {
			index = 0
		}
	  props.dispatch(setCurrentIndex(index))
		props.dispatch(setCurrentSong(props.currentSong))
		setSongReady(false)
	}, [props.currentIndex, songReady])

	const prev = useCallback(function(e) {
		e && e.stopPropagation()
		if (!songReady) {
			return
		}
		let index = props.currentIndex - 1
		if (index < 0) {
			index = props.playList.length - 1
		}
		props.dispatch(setCurrentIndex(index))
		props.dispatch(setCurrentSong(props.currentSong))
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
	  if(audioRef.current.duration) {
			setPercentage(currentTime / audioRef.current.duration)
		} 
	}, [])

	const percentageChanged = useCallback((value, isMoveAction) => {
	  if (audioRef.current.duration) {
			audioRef.current.currentTime = value * audioRef.current.duration
		}

		if (isMoveAction) {
			playingStateRef.current = false
			props.dispatch(setPlayingState(playingStateRef.current))
		} else {
			if (!playingStateRef.current) {
				togglePlaying()
			}
		}

		
	}, [])

	const iconMode = useMemo(() => {
		return props.playMode 
		=== playMode.sequence 
		? 
		'icon-sequence' 
		: props.playMode === playMode.loop 
		? 
		'icon-loop' : 'icon-random'
	}, [props.playMode])

	const changePlayMode = useCallback(() => {
		const mode = (props.playMode + 1) % 3
		props.dispatch(setPlayMode(mode))
		let tempList = {}
		Object.assign(tempList, props.sequenceList)
		let array = Object.values(tempList)
		let list = null
		if (mode === playMode.random) {
			list = shuffle(array)
		} else {
			list = array
		}
		// resetCurrentList(list)
		props.dispatch(setPlayList(list))
	}, [props.playMode, props.currentIndex])

	// const resetCurrentList = useCallback(list => {
	// 	const index = list.findIndex(item => {
	// 		return item.id === props.currentSong.id
	// 	})
	// 	props.dispatch(setCurrentIndex(index))
	// 	props.dispatch(setCurrentSong(props.currentSong))
	// }, [props.playMode, props.currentIndex])

	const end = useCallback(() => {
		if (props.playMode === playMode.loop) {
			loop()
		} else {
			next()
		}
	}, [props.playMode, songReady])

	const loop = useCallback(() => {
		audioRef.current.currentTime = 0
		audioRef.current.play()
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
				onExited={() => onExited()}>
				<div className="normal-player">
					<div className="background">
						<img width="100%" height="100%" src={props.currentSong.image} />
					</div>
					<div className="top">
						<div className="back" onClick={() => close()}>
							<i className="icon-back"></i>
						</div>
						<h1 className="title">{props.currentSong.name}</h1>
						<h2 className="subtitle">{props.currentSong.singer}</h2>
					</div>
					<div className="middle">
						<div className="middle-l">
							<div className="cd-wrapper" ref={cdWrapperRef}>
								<div className={`cd ${cdCls}`}>
									<img className="image" src={props.currentSong.image} />
								</div>
							</div>
						</div>
					</div>
					<div className="bottom">
						<div className="progress-wrapper">
							<span className="time time-l">{formatTime(currentTime)}</span>
							<div className="progress-bar-wrapper">
								<ProgressBar percent={percentage} percentageChanged={ (value, isMoveAction) => {percentageChanged(value, isMoveAction)} } />
							</div>
							{
								audioRef.current &&
								<span className="time time-r">{formatTime(audioRef.current.duration)}</span>
							}
							
						</div>
						<div className="operators">
							<div className="icon i-left"  onClick={e => { changePlayMode(e) }}>
								<i className={iconMode}></i>
							</div>
							<div className={`icon i-left ${disableCls}`}>
								<i className="icon-prev" onClick={e => prev(e)}></i>
							</div>
							<div className={`icon i-center ${disableCls}`}>
								<i className={ playIcon } onClick={e => { togglePlaying(e) }}></i>
							</div>
							<div className={`icon i-right ${disableCls}`}>
								<i className="icon-next" onClick={e => { next(e)}}></i>
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
						<img width="40" height="40" src={props.currentSong.image} className={cdCls} />
					</div>
					<div className="text">
						<h2 className="name">{props.currentSong.name}</h2>
						<p className="desc">{props.currentSong.singer}</p>
					</div>
					<div className="control" 
						onClick={
							e => {
								e.stopPropagation()
								togglePlaying() 
							}
						}>
							<ProgressCircle radius={32} percentage={percentage}>
								<i className={`icon-mini ${playMniIcon}`} />
							</ProgressCircle>
					</div>
					<div className="control">
						<i className="icon-playlist" />
					</div>
				</div>
			</CSSTransition>
			<audio 
				src={props.currentSong.url} 
				ref={audioRef} 
				onCanPlay={() => ready()} 
				onError={() => error()}
				onTimeUpdate={e => updateTime(e)}
				onEnded={()=>{end()}}
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