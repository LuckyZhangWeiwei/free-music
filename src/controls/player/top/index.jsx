import React, {memo} from 'react'
import { connect } from 'react-redux'

const Top = props => {
	return (
		<>
			<div className="back" onClick={() => props.close()}>
				<i className="icon-back"/>
			</div>
			<h1 className="title">{props.currentSong.name}</h1>
			<h2 className="subtitle">{props.currentSong.singer}</h2>
		</>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(Top))