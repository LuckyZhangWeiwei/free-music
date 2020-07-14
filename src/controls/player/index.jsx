import React from 'react'
import { connect } from 'react-redux'

import './index.stylus'

const player = function(props) {
	return (
		<div className="player">
			<div className="normal-player">播放器</div>
			<div className="mini-player"></div>
		</div>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(player)