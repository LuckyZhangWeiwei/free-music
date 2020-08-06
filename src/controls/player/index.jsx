import React, {memo, useState, useEffect, useRef, useCallback, useMemo} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import animations from 'create-keyframe-animation'
import classnames from 'classnames'
import Lyric from 'lyric-parser'

import { setFullScreen, setPlayList } from '../../store/actions'
import { prefixStyle } from '../../common/js/dom'
import { getSongUrl, getLynic } from '../../common/js/models/song'
import { setPlayingState, setCurrentIndex, setPlayMode, setCurrentSong } from '../../store/actions'
import ProgressBar from './../progress-bar'
import ProgressCircle from './../progress-circle'
import { playMode } from '../../common/js/config'
import { shuffle } from '../../common/js/util'
import Scroll from '../scroll'

import './index.stylus'
import './index.css'

const transform = prefixStyle('transform')

const transitionDuration = prefixStyle('transitionDuration')

const Player = function(props) {
	const [show, setShow] = useState(false)

	const [songReady, setSongReady] = useState(false)

	const [currentTime, setCurrentTime] = useState(0)

	const [percentage, setPercentage] = useState(0)

	const [currentShow, setCurrentShow] = useState('cd')

	const [initTouch, setInitTouch] = useState(false)

	const [playingLyric, setPlayingLyric] = useState('')

	const currentLineNumRef = useRef(-1)

	const cdWrapperRef = useRef()

	const audioRef = useRef()

	const playingStateRef = useRef(props.playingState)

	const lyricRef = useRef()

	const lyricListRef = useRef()

	const lyricLineRef = useRef()

	const touchRef = useRef({})

	const middleLRef = useRef()

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
			audioRef.current.play()
		})
	}, 
	[props.currentSong.url])

	useEffect(() => {
		if (lyricRef.current) {
			lyricRef.current.stop()
		}
		setTimeout(() => {
				getLynic(props.currentSong.name || props.currentSong.songname)
				.then(res => {
					lyricRef.current = new Lyric(res.lyric, handleLyric)
					if (playingStateRef.current) {
						lyricRef.current.play()
					}
				}).catch(() => {
					lyricRef.current = null
					setPlayingLyric('')
					currentLineNumRef.current = 0
				})
		}, 1000)
		lyricListRef.current.wrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
		middleLRef.current.style.opacity = 1
		lyricListRef.current.wrapperRef.current.style[transitionDuration] = 0
	}, [props.currentSong.id])

	const handleLyric = useCallback(({lineNum, txt}) => {
		currentLineNumRef.current = lineNum
		if (lineNum > 5) {
			let lineEl = lyricLineRef.current.children[lineNum - 5]
			lyricListRef.current.scrollToElement(lineEl, 1000)
		} else {
			lyricListRef.current.scrollTo(0, 0, 1000)
		}
		setPlayingLyric(txt)
		setCurrentShow('cd')
	}, [props.currentSong.id])

	useEffect(() => {
		const audio = audioRef.current
		playingStateRef.current ? audio.play() : audio.pause()	 
	}, [playingStateRef.current])

	useEffect(() => {
		if (!playingStateRef.current) {
			playingStateRef.current = true
			props.dispatch(setPlayingState(playingStateRef.current))
		}
		currentLineNumRef.current = 0
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
		if (lyricRef.current) {
			lyricRef.current.togglePlay()
		}
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
		if (props.playList.length === 1) {
			loop()
		} else {
			let index = props.currentIndex + 1
			if (index === props.playList.length) {
				index = 0
			}
			props.dispatch(setCurrentIndex(index))
			props.dispatch(setCurrentSong(props.currentSong))
			setSongReady(false)
		}
	}, [props.currentIndex, songReady])

	const prev = useCallback(function(e) {
		if (!songReady) {
			return
		}
		if (props.playList.length === 1) {
			loop()
		} else {
			let index = props.currentIndex - 1
			if (index < 0) {
				index = props.playList.length - 1
			}
			props.dispatch(setCurrentIndex(index))
			props.dispatch(setCurrentSong(props.currentSong))
			setSongReady(false)
		}
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

		if (lyricRef.current) {
			lyricRef.current.seek(audioRef.current.currentTime * 1000)
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
		props.dispatch(setPlayList(list))
	}, [props.playMode, props.currentIndex])

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

		if (lyricRef.current) {
			lyricRef.current.seek(0)
		}
	}, [])

	const middleTouchStart = useCallback((e) => {
		// e.stopPropagation()
		if (!initTouch)
			setInitTouch(true)
		const touch = e.touches[0]
		touchRef.current.startX = touch.pageX
		touchRef.current.startY = touch.pageY
	}, [initTouch, currentShow])

	const middleTouchMove = useCallback((e) => {
		// e.stopPropagation()
		if (!touchRef.current) {
			return
		}
		if (!initTouch) {
			return
		}
		const touch = e.touches[0]
		const deltaX = touch.pageX - touchRef.current.startX
		const deltaY = touch.pageY - touchRef.current.startY
		touchRef.current.shouldSlide = true
		if (Math.abs(deltaY) > Math.abs(deltaX)) {
			touchRef.current.shouldSlide = false
			return
		}
		const left = currentShow === 'cd' ? 0 : -window.innerWidth
		const offsetWidth = Math.min(Math.max(-window.innerWidth, left + deltaX), 0)
		touchRef.current.percentage = Math.abs(offsetWidth / window.innerWidth)
		lyricListRef.current.wrapperRef.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
		lyricListRef.current.wrapperRef.current.style[transitionDuration] = 0
		middleLRef.current.style.opacity = 1 - touchRef.current.percentage
		middleLRef.current.style[transitionDuration] = 0
	}, [initTouch, currentShow])

	const middleTouchEnd = useCallback((e) => {
		// e.stopPropagation()
		if (!touchRef.current.shouldSlide) {
			return
		}
		let offsetWidth
		let offsetOpacity
		if (currentShow === 'cd') {
			if (touchRef.current.percentage > 0.1) {
				offsetWidth = -window.innerWidth
				offsetOpacity = 0
				setCurrentShow('lyric')
			} else {
				offsetWidth = 0
				offsetOpacity = 1
			}
		} else {
			if (touchRef.current.percentage < 0.9) {
				offsetWidth = 0
				offsetOpacity = 1
				setCurrentShow('cd')
			} else {
				offsetWidth = -window.innerWidth
				offsetOpacity = 0
			}
		}
		lyricListRef.current.wrapperRef.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
		lyricListRef.current.wrapperRef.current.style[transitionDuration] = '300ms'
		middleLRef.current.style.opacity = offsetOpacity
		middleLRef.current.style[transitionDuration] = '300ms'
		setInitTouch(false)
	}, [initTouch, currentShow])

	return (
		<div className="player">
			<CSSTransition 
				timeout={400} 
				in={show} 
				classNames="normal"
				onEnter={() => onEnter()}
				onEntering={() => onEntering()}
				onEntered={() => onEntered()}
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
					<div className="middle" 
						onTouchStart={(e) => middleTouchStart(e)}
						onTouchMove={(e) => middleTouchMove(e)}
						onTouchEnd={(e) => middleTouchEnd(e)}
						>
						<div className="middle-l" ref={middleLRef}>
							<div className="cd-wrapper" ref={cdWrapperRef}>
								<div className={`cd ${cdCls}`}>
									<img className="image" src={props.currentSong.image} />
								</div>
							</div>
							<div className="playing-lyric-wrapper">
								<div className="playing-lyric">{playingLyric}</div>
							</div>
						</div>
						<Scroll className="middle-r" ref={lyricListRef} data={lyricRef.current && lyricRef.current.lines}>
							<div className="lyric-wrapper" ref={lyricLineRef}>
								{
									lyricRef.current &&
									lyricRef.current.lines.map((item,index) => {
										return (
											<p key={index} className={classnames('text', {'current': currentLineNumRef.current === index})}>{item.txt}</p>
										)	
									})
								}
							</div>
						</Scroll>
					</div>
					<div className="bottom">
						<div className="dot-wrapper">
							<span className={classnames('dot', {'active': currentShow === 'cd'})}></span>
							<span className={classnames('dot', {'active': currentShow === 'lyric'})}></span>
						</div>
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
				onEnded={()=>{end()}} />
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