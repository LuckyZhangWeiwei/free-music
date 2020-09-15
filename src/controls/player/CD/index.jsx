import React, {memo} from 'react'
import { connect } from 'react-redux'

const CD = props => {
	return (
			<div className="middle-l" ref={props.middleLRef}>
				<div className="cd-wrapper" ref={props.cdWrapperRef}>
					<div className={`cd ${props.cdCls}`}>
						<img className="image" src={props.currentSong.image} alt="" />
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