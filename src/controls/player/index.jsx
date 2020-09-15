import React, {memo, useState, useEffect, useRef, useCallback, useMemo} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import animations from 'create-keyframe-animation'
import Lyric from 'lyric-parser'

import { prefixStyle } from '../../common/js/dom'
import { getSongUrl, getLynic } from '../../common/js/models/song'
import { setPlayingState, setCurrentIndex, setCurrentSong, setFullScreen } from '../../store/actions'
import ProgressBar from './../progress-bar'
import { playMode } from '../../common/js/config'
import PlayList from '../playlist'
import MusicOperator from './operators'
import MiniPlayer from './mini-player'
import Cover from './player-conver'
import PlayerLyric from './Lyric'
import CD from './CD'
import Top from './top'

import './index.stylus'
import './index.css'

const transform = prefixStyle('transform')

const transitionDuration = prefixStyle('transitionDuration')

const Player = props => {
	const [show, setShow] = useState(false)

	const [songReady, setSongReady] = useState(false)

	const [currentTime, setCurrentTime] = useState(0)

	const [percentage, setPercentage] = useState(0)

	const [currentShow, setCurrentShow] = useState('cd')

	const [initTouch, setInitTouch] = useState(false)

	const [playingLyric, setPlayingLyric] = useState('')

	const [showPlayList, setShowPlayList] = useState(false)

	const [lastAction, setLastAction] = useState(null)

	const [lyricLines, setLyricLines] = useState([])

	const [currentLineNum, setCurrentLineNum] = useState(-1)

	const cdWrapperRef = useRef()

	const audioRef = useRef()

	const playingStateRef = useRef(props.playingState)

	const lyricRef = useRef(null)

	const lyricListRef = useRef(null)

	const lyricLineRef = useRef(null)

	const touchRef = useRef({})

	const middleLRef = useRef(null)

	useEffect(() => {
		setShow(true)
	}, [])

	useEffect(() => {
		setShow(props.isFullScreen)
	}, [props.isFullScreen])

	useEffect(() => {
		getSongUrl(props.currentSong.name || props.currentSong.songname)
		.then(songUrl => {
			if (songUrl) {
				const song = {
					...props.currentSong,
					url: songUrl
				}
				props.dispatch(setCurrentSong(song))
				audioRef.current.play()
			} else {
				if (props.playList.length === 1) {
					loop()
				} else {
					let index = props.currentIndex + 1
					if (index === props.playList.length) {
						index = 0
					}
					props.dispatch(setCurrentIndex(index))
					props.dispatch(setCurrentSong(props.playList[index]))
					setSongReady(false)
				}
			}
		})
	},
	[props.currentSong.id] 
	)

	useEffect(() => {
		if (lyricRef.current) {
			lyricRef.current.stop()
		}
		setTimeout(() => {
				getLynic(props.currentSong.name || props.currentSong.songname)
				.then(res => {
					lyricRef.current = new Lyric(res.lyric, handleLyric)
					if (playingStateRef.current) {
						setLyricLines(lyricRef.current.lines)
						lyricRef.current.play()
					}
				}).catch(() => {
					lyricRef.current = null
					setPlayingLyric('')
					setCurrentLineNum(0)
				})
		}, 1000)
		lyricListRef.current.wrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
		middleLRef.current.style.opacity = 1
		lyricListRef.current.wrapperRef.current.style[transitionDuration] = 0
	}, [props.currentSong.id])

	const handleLyric = useCallback(({lineNum, txt}) => {
		if (!props.sequenceList.length) return
		
		setCurrentLineNum(lineNum)
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
		setCurrentLineNum(0)
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

	const next = useCallback(e => {
		setLastAction('next')

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
			props.dispatch(setCurrentSong(props.playList[index]))
			setSongReady(false)
		}
	},
	[props.currentIndex, songReady, lastAction, props.currentSong.id]
	)

	const prev = useCallback(e => {
		setLastAction('prev')

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
			props.dispatch(setCurrentSong(props.playList[index]))
			setSongReady(false)
		}
	}, 
	[props.currentIndex, songReady, lastAction, props.currentSong.id]
	)

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
		if (!initTouch)
			setInitTouch(true)
			const touch = e.touches[0]
			touchRef.current.startX = touch.pageX
			touchRef.current.startY = touch.pageY
	}, [initTouch, currentShow])

	const middleTouchMove = useCallback((e) => {
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
						<img width="100%" height="100%" src={props.currentSong.image} alt="" />
					</div>
					<div className="top">
						<Top close={close} />
					</div>
					<div className="middle" 
						onTouchStart={(e) => middleTouchStart(e)}
						onTouchMove={(e) => middleTouchMove(e)}
						onTouchEnd={(e) => middleTouchEnd(e)}
						>
						<CD
							middleLRef={middleLRef}
							cdWrapperRef={cdWrapperRef}
							cdCls={cdCls}
							playingLyric={playingLyric}
						/>
						<PlayerLyric
						 lyricListRef={lyricListRef}
						 lyricLines = {lyricLines}
						 currentLineNum={currentLineNum}
						 lyricLineRef={lyricLineRef}
						/>
					</div>
					<div className="bottom">
						<Cover 
							currentShow={currentShow}
							formatTime={formatTime}
							currentTime={currentTime}
							audioRef={audioRef}
						>
							<ProgressBar percent={percentage} percentageChanged={ (value, isMoveAction) => {percentageChanged(value, isMoveAction)} } />
						</Cover>
						<div className="operators">
							<MusicOperator
								disableCls={disableCls}
								playIcon={playIcon}
								prev={prev}
								next={next}
								togglePlaying={togglePlaying}
							/>
						</div>
					</div>
				</div>
			</CSSTransition>
			<CSSTransition timeout={200} in={!show} classNames="mini">
				<MiniPlayer
					open={open}
					cdCls={cdCls}
					togglePlaying={togglePlaying}
					percentage={percentage}
					playMniIcon={playMniIcon}
					setShowPlayList={setShowPlayList}
					showPlayList={showPlayList}
				/>
			</CSSTransition>
			{
				!!showPlayList &&
				<PlayList hidePlayList = {() => setShowPlayList(!showPlayList)}></PlayList>
			}
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