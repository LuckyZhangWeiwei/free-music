import React, {useState, useEffect} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { getSingerDetail } from './../../api/singer'
import { creatSong } from './../../common/js/models/song'

import './index.stylus'
import { ERR_OK } from '../../api/config'

const SingerDetail = function(props) {
	const [show, setShow] = useState(false)
	const [song, setSong] = useState([])
	
	useEffect(() => {
		setShow(true)
	}, [show])

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
					console.log(ret)
					setSong(ret)
				}
			})
	}, [props.singer.id, props.history]
	)

	function _normalizeSongs (list) {
		let result = []
		list.forEach(item => {
			let { musicData } = item
			const ret = creatSong(musicData)
			result.push(ret)
		})
		return result
	}

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="singer-detail">
				singer detail
				<p></p>
			</div>
		</CSSTransition>
	)
}

export default connect(
	function mapStateToProps(state) {
    return state
  },
	function mapDispatchToProps(dispatch){
		return { dispatch }
})(SingerDetail)