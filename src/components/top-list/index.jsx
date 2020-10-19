import React, { useState, useEffect, memo, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import MusicList from '../../controls/music-list'
import { getMusicList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import { creatSong } from '../../common/js/models/song'
import { loadPlayList } from '../../store/actions'

import './index.stylus'

const TopList = function (props) {
	const [show, setShow] = useState(false)
	const [song, setSong] = useState([])

	useEffect(() => {
		setShow(true)
	}, [])

	useEffect(() => {
		if (!props.topList.id) {
				props.history.push({
				pathname: '/rank'
			})
			return
		}
		getMusicList(props.topList.id).then(res => {
			if (res.code === ERR_OK) {
				let list = _normalizeSongs(res.songlist)
				setSong(list)
				props.dispatch(loadPlayList(list))
			}
		})
	}, [props.topList.id])

	const _normalizeSongs = useCallback((songList) => {
		const ret = []
		songList.forEach(item => {
			const musicData = item.data
			
			if (musicData.songid && musicData.albumid) {
				ret.push(creatSong(musicData))
			}
		})
		return ret
	}, [])

	const handleBackClick  = useCallback(() => {
			setShow(false)
	}, [show])

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<MusicList 
				song={song} 
				title={props.topList.topTitle} 
				bgImage={props.topList.picUrl} 
				history={props.history} 
				rank={true}
				handleBackClick={() => handleBackClick()}
			/>
		</CSSTransition>
	)
}

export default connect(
	function mapStateToProps(state) {
    return state
  },
	function mapDispatchToProps(dispatch){
		return { dispatch }
})(memo(TopList))