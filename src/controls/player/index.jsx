import React, {memo, useEffect, useRef, useCallback, useMemo, useReducer } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import animations from 'create-keyframe-animation'
import Lyric from 'lyric-parser'

import { prefixStyle } from '../../common/js/dom'
import { getSongUrl, getLynic } from '../../common/js/models/song'
import { setPlayingState, setCurrentIndex, setCurrentSong, setFullScreen, setPlayHistory } from '../../store/actions'
import ProgressBar from './../progress-bar'
import { playMode } from '../../common/js/config'
import { formatTime } from '../../common/js/util'
import { initialPlayerState, playerReducer } from './reducer/initState'
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
	const [state, dispatch] = useReducer(playerReducer, initialPlayerState)

	const {
		showNormalPlayer,
		showPlayList,
		songReady,
		currentTime,
		percentage,
		currentShow,
		initTouch,
		currentPlayingLyric,
		currentLineNum,
		lyricLines,
		lastPreOrNextAction
	} = state

	const cdWrapperRef = useRef(null)

	const audioRef = useRef(null)

	const lyricRef = useRef(null)

	const lyricListRef = useRef(null)

	const lyricLineRef = useRef(null)

	const touchRef = useRef({})

	const middleLRef = useRef(null)

	useEffect(() => {
		getSongUrl(props.currentSong.name || props.currentSong.songname)
		.then(playerUrl => {
			const url = !!playerUrl ? playerUrl : ''
			const song = {
				...props.currentSong,
				url
			}
			// update current song player url
			props.dispatch(setCurrentSong(song))

			// reset song ready status
			_setMusicReadyState(false)

			audioRef.current.play()
		})
	}, [props.currentSong.id])

	//when switch music, change music-show normal player fistly
	useEffect(() => {
			props.dispatch(setFullScreen(true))
			
			dispatch({
				type: 'set_show_normal_player',
				payload: true
			})
	}, [props.currentSong.id])

	useEffect(() => {
		if (lyricRef.current) {
			lyricRef.current.stop()
		}
		setTimeout(() => {
				getLynic(props.currentSong.name || props.currentSong.songname)
				.then(res => {
					if (res) {
						lyricRef.current = new Lyric(res.lyric, handleLyric)
						if (props.playingState) {
							dispatch({
								type: 'set_lyricLines',
								payload: lyricRef.current.lines
							})
							dispatch({
								type: 'set_currentLineNum',
								payload: 0
							})
							lyricRef.current.play()
						}
					} else {
							dispatch({
								type: 'set_lyricLines',
								payload: []
							})
							dispatch({
								type: 'set_currentPlayingLyric',
								payload: ''
							})
							dispatch({
								type: 'set_currentLineNum',
								payload: 0
							})
					}
				!!lyricListRef.current &&
					lyricListRef.current.scrollTo(0, 0, 1000)

				}).catch(() => {
					lyricRef.current = null
					dispatch({
						type: 'set_currentPlayingLyric',
						payload: ''
					})

					dispatch({
						type: 'set_currentLineNum',
						payload: 0
					})
				})
		}, 300)
		if (lyricListRef.current) {
			lyricListRef.current.wrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
			lyricListRef.current.wrapperRef.current.style[transitionDuration] = 0
		}
		middleLRef.current.style.opacity = 1
	}, [props.currentSong.id])

	useEffect(() => {
		const audio = audioRef.current
		props.playingState ? audio.play() : audio.pause()
	}, [props.playingState])

	const handleLyric = useCallback(({lineNum, txt}) => {
		if (!props.sequenceList.length) return
		
		dispatch({
			type: 'set_currentLineNum',
			payload: lineNum
		})
		if (lineNum > 5) {
			let lineEl = !!lyricLineRef.current && lyricLineRef.current.children[lineNum - 5]
		  !!lyricListRef.current &&	!!lineEl &&
			lyricListRef.current.scrollToElement(lineEl, 1000)
		} else {
			!!lyricListRef.current &&
			lyricListRef.current.scrollTo(0, 0, 1000)
		}
		dispatch({
			type: 'set_currentPlayingLyric',
			payload: txt
		})

		dispatch({
			type: 'set_current_show',
			payload: 'cd'
		})
	}, [props.currentSong.id])

	const close = () => {
		props.dispatch(setFullScreen(false))

		dispatch({
			type: 'set_show_normal_player',
			payload: false
		})
	}

	const open = () => {
		props.dispatch(setFullScreen(true))

		dispatch({
			type: 'set_show_normal_player',
			payload: true
		})
	}

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

	const togglePlaying = useCallback(() => {
		props.dispatch(setPlayingState(!props.playingState))
		if (lyricRef.current) {
			lyricRef.current.togglePlay()
		}
	}, [props.playingState])

	const cdCls = useMemo(() => {
		return props.playingState ? 'play' : 'play pause'
	}, [props.playingState])

	const disableCls = useMemo(() => {
		return songReady ? '' : 'disable'
	}, [songReady])

	const prev = useCallback((e, errorSkip = false) => {
		dispatch({
			type: 'set_lastPre_or_next_action',
			payload: 'prev'
		})

		if (!!props.currentSong.url) {
				_setMusicReadyState(false)
		}

		if (!songReady && !errorSkip) {
			return
		}

		if (props.playList.length === 1 || props.playMode === playMode.loop) {
			loop()
		} else {
			let index = props.currentIndex - 1
			if (index < 0) {
				index = props.playList.length - 1
			}
			props.dispatch(setCurrentIndex(index))
			props.dispatch(setCurrentSong(props.playList[index]))
		}
	}, 
	[songReady, props.currentSong.id, props.playMode]
	)
	const next = useCallback((e, errorSkip = false) => {
		// why can not get current songReady state ???
		dispatch({
			type: 'set_lastPre_or_next_action',
			payload: 'next'
		})

		if (!!props.currentSong.url) {
			_setMusicReadyState(false)
		}

		if (!songReady && !errorSkip) {
			return
		}

		if (props.playList.length === 1 || props.playMode === playMode.loop) {
			loop()
		} else {
			let index = props.currentIndex + 1
			if (index === props.playList.length) {
				index = 0
			}
			props.dispatch(setCurrentIndex(index))
			props.dispatch(setCurrentSong(props.playList[index]))
		}
	}, 
	[songReady, props.currentSong.id, props.playMode]
	)

	const onCanPlay = () => {
		_setMusicReadyState(true)

		props.dispatch(setPlayHistory(props.currentSong))
	}

	const onError = () => {
		_setMusicReadyState(true)

		if (lastPreOrNextAction === 'next') {
			dispatch({
				type: 'set_lastPre_or_next_action',
				payload: 'next'
			})
			next(null, true)
		} else {
			dispatch({
				type: 'set_lastPre_or_next_action',
				payload: 'prev'
			})
			prev(null, true)
		}
		_setMusicReadyState(false)
	}

	const	onPlay = () => {
		props.dispatch(setPlayingState(true))
	}
	const	onPause = () => {
		props.dispatch(setPlayingState(false))
	}

	const updateTime = useCallback((e) => {
		let currentTime = e.target.currentTime
		dispatch({
			type: 'set_currenttime',
			payload: currentTime
		})
	  if(audioRef.current.duration) {
			dispatch({
				type: 'set_percentage',
				payload: currentTime / audioRef.current.duration
			})
		} 
	}, [])

	const percentageChanged = useCallback((value, isMoveAction) => {
	  if (audioRef.current.duration) {
			audioRef.current.currentTime = value * audioRef.current.duration
		}
		if (isMoveAction) {
			if (props.playingState) {
				props.dispatch(setPlayingState(false))
			}
		} else {
			//dragmove end
			props.dispatch(setPlayingState(true))
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
	}, [props.playMode, songReady, props.currentSong.id])

	const loop = useCallback(() => {
		audioRef.current.currentTime = 0
		audioRef.current.play()

		if (lyricRef.current) {
			lyricRef.current.seek(0)
		}
	}, [])

	const middleTouchStart = useCallback((e) => {
		if (!lyricLines.length) {
			return
		}
		if (!initTouch) {
			dispatch({
				type: 'set_init_touch',
				payload: true
			})
		}
			const touch = e.touches[0]
			touchRef.current.startX = touch.pageX
			touchRef.current.startY = touch.pageY
	}, [initTouch, currentShow, lyricLines])

	const middleTouchMove = useCallback(e => {
		if (!touchRef.current) {
			return
		}
		if (!initTouch) {
			return
		}
		if (!lyricLines.length) {
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
		if (lyricListRef.current) {
			lyricListRef.current.wrapperRef.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
			lyricListRef.current.wrapperRef.current.style[transitionDuration] = 0
		}
		middleLRef.current.style.opacity = 1 - touchRef.current.percentage
		middleLRef.current.style[transitionDuration] = 0
	}, [initTouch, currentShow, lyricLines])

	const middleTouchEnd = useCallback((e) => {
		if (!touchRef.current.shouldSlide) {
			return
		}
		if (!lyricLines.length) {
			return
		}
		let offsetWidth
		let offsetOpacity
		if (currentShow === 'cd') {
			if (touchRef.current.percentage > 0.1) {
				offsetWidth = -window.innerWidth
				offsetOpacity = 0
				dispatch({
					type: 'set_current_show',
					payload: 'lyric'
				})
			} else {
				offsetWidth = 0
				offsetOpacity = 1
			}
		} else {
			if (touchRef.current.percentage < 0.9) {
				offsetWidth = 0
				offsetOpacity = 1
					dispatch({
					type: 'set_current_show',
					payload: 'cd'
				})
			} else {
				offsetWidth = -window.innerWidth
				offsetOpacity = 0
			}
		}
		if (lyricListRef.current) {
			lyricListRef.current.wrapperRef.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
			lyricListRef.current.wrapperRef.current.style[transitionDuration] = '300ms'
		}
		middleLRef.current.style.opacity = offsetOpacity
		middleLRef.current.style[transitionDuration] = '300ms'
		dispatch({
			type: 'set_init_touch',
			payload: false
		})
	}, [initTouch, currentShow])

	const setShowPlayList = useCallback(payload => {
		dispatch({
			type: 'set_show_playlist',
			payload
		})
	}, [])

	const _setMusicReadyState = useCallback(props => {
		dispatch({
			type: 'set_song_ready',
			payload: props
		})
	}, [songReady])

	return (
			<div className="player">
				<CSSTransition 
					timeout={400} 
					in={showNormalPlayer} 
					classNames="normal"
					onEnter={() => onEnter()}
					onEntering={() => onEntering()}
					onEntered={() => onEntered()}
					onExiting={() => onExiting()}
					onExited={() => onExited()}
					>
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
								playingLyric={currentPlayingLyric}
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
								lyricLines = {lyricLines}
								currentTime={currentTime}
								audioRef={audioRef}
							>
								<ProgressBar 
									percent={percentage} 
									percentageChanged={ (value, isMoveAction) => percentageChanged(value, isMoveAction) } />
							</Cover>
							<div className="operators">
								<MusicOperator
									disableCls={disableCls}
									playIcon={playIcon}
									prev={prev}
									next={next}
									togglePlaying={togglePlaying}
									currentSong={props.currentSong}
								/>
							</div>
						</div>
					</div>
				</CSSTransition>
				{
					!showNormalPlayer &&
						<CSSTransition timeout={200} in={!showNormalPlayer} classNames="mini">
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
				}
				{
					!!showPlayList &&
					<PlayList 
						hidePlayList = {() => setShowPlayList(!showPlayList)} 
					/>
				}
				<audio 
					src={props.currentSong.url} 
					ref={audioRef}
					onCanPlay={() => onCanPlay()} 
					onError={() => onError()}
					onTimeUpdate={e => updateTime(e)}
					onEnded={() => end()}
					onPlay={() => onPlay()}
					onPause={() => onPause()}
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