import React, { useState, useEffect, memo, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import MusicList from '../../controls/music-list'

import './index.stylus'

const TopList = function (props) {
	const [show, setShow] = useState(false)
	const [song, setSong] = useState([])

	useEffect(() => {
		setShow(true)
	}, [])

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<MusicList song={song} title={props.topList.topTitle} bgImage={props.topList.picUrl} history={props.history} />
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