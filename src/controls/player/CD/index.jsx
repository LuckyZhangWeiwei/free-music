import React, { memo, useLayoutEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'

const CD = props => {
	const [leftOrRight, setLeftOrRight] = useState(props.showSlider)
	
	useLayoutEffect(() => {
		setLeftOrRight(props.showSlider === null ? null : props.showSlider === 'left' ? 'leftslide' : 'rightslide')
	}, [props.showSlider])
	
	return (
		<div className={`middle-l ${props.playingState ? 'playing' : ''}`}  ref={props.middleLRef}>
			<div className="cd-wrapper"  ref={props.cdWrapperRef}>
				<div className="cd">
					<CSSTransition 
						timeout={300} 
						classNames={`${leftOrRight}`} 
						in={ leftOrRight !== null ? true : false }>
						<img 
							className={`image ${props.cdCls}`} 
							src={props.currentSong.image}
							alt="" 
						/>
					</CSSTransition>
				</div>
			</div>
			<div className="playing-lyric-wrapper">
				<div className="playing-lyric">{props.playingLyric}</div>
			</div>
		</div>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(CD))