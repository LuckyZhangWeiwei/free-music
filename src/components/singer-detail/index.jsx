import React, {useState, useEffect, useCallback, memo, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { getSingerDetail } from './../../api/singer'
import { creatSong } from './../../common/js/models/song'
import MusicList from '../../controls/music-list'

import './index.stylus'
import { ERR_OK } from '../../api/config'
import { loadPlayList } from '../../store/actions'

function _normalizeSongs (list) {
		let result = []
		list.forEach(item => {
			let { musicData } = item
			const ret = creatSong(musicData)
			result.push(ret)
		})
		return result
}

const SingerDetail = function(props) {
	const [show, setShow] = useState(false)
	const [song, setSong] = useState([])

	const containerRef = useRef(null)
	
	useEffect(() => {
		setShow(true)
	}, [])

	useEffect(() => {
		if (!props.singer.id) {
			props.history.push({
				pathname: '/singer'
			})
			return
		}
		
		getSingerDetail(props.singer.id)
			.then(res => {
				if (ERR_OK === res.code) {
					const data = res.data.list
					const ret = _normalizeSongs(data)
					setSong(ret)
					props.dispatch(loadPlayList(ret))
				}
			})
		}, [props.singer.id, props.history]
	)

	const handleBackClick = useCallback(() => {
		setShow(false)
	}, [show])

	return (
		<div ref={containerRef}>
			<CSSTransition timeout={300} classNames="slide" in={show}>
				<MusicList 
					song={song} 
					title={props.singer.name} 
					bgImage={props.singer.avatar} 
					history={props.history}
					handleBackClick={() => handleBackClick()}
				/>
			</CSSTransition>
		</div>
	)
}

export default connect(
	function mapStateToProps(state) {
    return state
  },
	function mapDispatchToProps(dispatch){
		return { dispatch }
})(memo(SingerDetail))