import React, { memo, useCallback } from 'react'
import { connect } from 'react-redux'
import Scroll from '../../scroll'
import SongList from '../../song-list'
import { insertSong } from '../../../store/actions'
import { Song } from '../../../common/js/models/song'

const RecentPlayList = props => {
	const select = useCallback((song, index) => {
		if (index !==0) {
			props.dispatch(insertSong(new Song(song)))
		}
	}, [])

	return (
		<>
		<Scroll
		 	ref={props.myRef}
			className="list-scroll" 
			data={props.playHistory}>
			<div className="list-inner">
				<SongList 
					songs={props.playHistory} 
					select={(song, index) => select(song, index)} 
				/>
			</div>
		</Scroll>
		</>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(RecentPlayList))