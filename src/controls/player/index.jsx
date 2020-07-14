import React, {memo} from 'react'
import { connect } from 'react-redux'

import './index.stylus'

const player = function(props) {
	return (
		<div className="player">
			{
				props.isFullScreen 
				&&
				<div className="normal-player">播放器</div>
			}
			{
				!props.isFullScreen
				&&
				<div className="mini-player"></div>
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
})(memo(player))