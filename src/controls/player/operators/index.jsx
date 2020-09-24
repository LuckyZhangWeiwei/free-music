import React, {memo, useCallback} from 'react'
import { connect } from 'react-redux'
import PlayMode from '../../../controls/playmode'
import {setFaviorateList, deleteFavoriteList} from '../../../store/actions'


const MusicOperator = props => {
	const getFavoriteIcon = useCallback(() => {
		return _isFavoriate() ? 'icon-favorite' : 'icon-not-favorite'
	}, [props.favoriteList.length])

	const toggleFavoriate = useCallback(e => {
		e.stopPropagation()
		if (_isFavoriate()) {
			props.dispatch(deleteFavoriteList(props.currentSong))
		} else {
			props.dispatch(setFaviorateList(props.currentSong))
		}
	}, [props.favoriteList.length])

	const _isFavoriate = useCallback(() => {
		const index = props.favoriteList.findIndex(item => { return item.id === props.currentSong.id })
		return index > -1
	}, [props.favoriteList.length])

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
			<div className="icon i-right" onClick={e => toggleFavoriate(e)}>
				<i className={`icon ${getFavoriteIcon()}`}></i>
			</div>
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