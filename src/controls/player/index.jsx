import React, {memo, useState, useEffect, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import animations from 'create-keyframe-animation'

import { setFullScreen } from '../../store/actions'
import { prefixStyle } from '../../common/js/dom'

import './index.stylus'
import './index.css'

const transform = prefixStyle('transform')
const transformDuration = prefixStyle('transformDuration')

const Player = function(props) {
	const [show, setShow] = useState(false)

	const cdWrapperRef = useRef()

	useEffect(() => {
		setShow(true)
	}, [])

	useEffect(() => {
		setShow(props.isFullScreen)
	}, [props.isFullScreen])

	const close = function() {
		props.dispatch(setFullScreen(false))
		setShow(false)
	}

	const open = function() {
		props.dispatch(setFullScreen(true))
		setShow(true)
	}

	const onEnter = function (el) {
			const {x, y, scale} = _getPosAndScale()
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
	}

	const onEntering = function (el) {
		animations.runAnimation(cdWrapperRef.current, 'move', null)
	}

	const onEntered = function (el) {
		animations.unregisterAnimation('move')
		cdWrapperRef.current.style.animation = ''
	}

	const onExit = function(el) {}

	const onExiting = function(el) {
		cdWrapperRef.current.style.transition = 'all 0.2s'
    const {x, y, scale} = _getPosAndScale()
    cdWrapperRef.current.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    cdWrapperRef.current.addEventListener('transitionend', null)
	}

	const onExited = function(el) {
		cdWrapperRef.current.style.transition = ''
    cdWrapperRef.current.style[transform] = ''
	}

	const _getPosAndScale = function () {
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
	}

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
								<div className="cd">
									<img className="image" src={props.currentSong.image} />
								</div>
							</div>
						</div>
					</div>
					<div className="bottom">
						<div className="operators">
							<div className="icon i-left">
								<i className="icon-sequence"></i>
							</div>
							<div className="icon i-left">
								<i className="icon-prev"></i>
							</div>
							<div className="icon i-center">
								<i className="icon-play"></i>
							</div>
							<div className="icon i-right">
								<i className="icon-next"></i>
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
						<img width="40" height="40" src={props.currentSong.image} />
					</div>
					<div className="text">
						<h2 className="name">{props.currentSong.title}</h2>
						<p className="desc">{props.currentSong.singer}</p>
					</div>
					<div className="control"></div>
					<div className="control">
						<i className="icon-playlist"></i>
					</div>
				</div>
			</CSSTransition>
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