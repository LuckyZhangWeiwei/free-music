import React, {memo, useState, useEffect} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import MusicList from '../../controls/music-list'
import { getDiscDetail } from '../../api/recommend'
import { getSongById } from '../../api/song'
import { Song } from '../../common/js/models/song'
import { loadPlayList } from '../../store/actions'

import './index.stylus'

const Disc = props => {
	
	const [show, setShow] = useState(false)
	const [song, setSong] = useState([])

	useEffect(() => {
		setShow(true)
	}, [])

	useEffect(() => {
		if (!props.disc.id) {
			props.history.push({
				pathname: '/recommend'
			})
			return
		}
		
		getDiscDetail(props.disc.id).then(data => {
			return data.playlist.trackIds
		}).then(idObjects => {
			const array = []
			idObjects.forEach(item => {
				array.push(item.id)
			})
			return array
		}).then(ids => {
		 return	getSongById(ids).then(data => {
				return data.data.songs
			})
		}).then(res => {
			let songs = []
			res.forEach(item => {
				let song = new Song({
					id: item.al.id, 
					mid: null, 
					singer: item.ar[0].name, 
					name: item.al.name, 
					album: item.al.tns[0], 
					duration:null, 
					image: item.al.picUrl, 
					url: null
				})
				songs.push(song)
			})
			return songs
		}).then(songs => {
			setSong(songs)
			props.dispatch(loadPlayList(songs))
		})
	}, [props.disc.id])

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<MusicList song={song} title={props.disc.name} bgImage={props.disc.coverImgUrl} history={props.history} />
		</CSSTransition>
	)
}

export default connect(
	function mapStateToProps(state) {
    return state
  },
	function mapDispatchToProps(dispatch){
		return { dispatch }
})(memo(Disc))