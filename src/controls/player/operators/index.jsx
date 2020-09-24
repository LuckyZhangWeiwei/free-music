import React, {memo} from 'react'
import { connect } from 'react-redux'
import PlayMode from '../../../controls/playmode'
import FavoriteButton from './favorite-button'

const MusicOperator = props => {
	return (
		<>
			<PlayMode />
			<div className={`icon i-left ${props.disableCls}`}>
				<i className="icon-prev" onClick={e => props.prev(e)}></i>
			</div>
			<div className={`icon i-center ${props.disableCls}`}>
				<i className={ props.playIcon } onClick={e => props.togglePlaying(e)}></i>
			</div>
			<div className={`icon i-right ${props.disableCls}`}>
				<i className="icon-next" onClick={e => props.next(e)}></i>
			</div>
			<FavoriteButton 
				className="icon i-right"
				song={props.currentSong}
			/>
		</>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(MusicOperator))