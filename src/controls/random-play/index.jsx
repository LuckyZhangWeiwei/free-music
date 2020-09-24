import React, {memo, useCallback}  from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { selectPlay, random } from '../../store/actions'

const RandomPlay = props => {
	const randomPlay = useCallback(() => {
		props.dispatch(random(props.sequenceList))
		props.dispatch(selectPlay(props.song, props.currentIndex + 1))
	}, [props.sequenceList])

	return (
		<div className="play-wrapper" ref={props.playWrapperRef}>
			<div className="play" onClick={() => {randomPlay()}}>
				<i className="icon-play"></i>
				<span className="text">{props.text}</span>
			</div>
		</div>
	)
}

RandomPlay.propTypes = {
	text: PropTypes.string.isRequired,
	song: PropTypes.array.isRequired,
	playWrapperRef: PropTypes.object
}


export default connect(function mapStateToProps(state) {
	return {...state}
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(RandomPlay))