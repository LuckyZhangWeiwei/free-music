import React, {memo, useState, useEffect} from 'react'
import { connect } from 'react-redux'

import { setFullScreen } from '../../store/actions'

import './index.stylus'

const Player = function(props) {
	const [currentSong, setCurrentSong] = useState()

	useEffect(() => {
		setCurrentSong(props.playList[props.currentIndex])
	}, [props.playList, props.currentIndex])
	
	const close = function() {
		props.dispatch(setFullScreen(false))
	}

	const open = function() {
		props.dispatch(setFullScreen(true))
	}
	

	return (
		<div className="player">
			{
				props.isFullScreen && currentSong
				&&
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
							<div className="cd-wrapper">
								<div className="cd">
									<img className="image" src={currentSong.image} />
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
			}
			{
				!props.isFullScreen && currentSong
				&&
				<div className="mini-player" onClick={() => open()}>
					<div className="icon">
						<img width="40" height="40" src={currentSong.image} />
					</div>
					<div className="text">
						<h2 className="name">{currentSong.title}</h2>
						<p className="desc">{currentSong.singer}</p>
					</div>
					<div className="control"></div>
					<div className="control">
						<i className="icon-playlist"></i>
					</div>
				</div>
			}
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