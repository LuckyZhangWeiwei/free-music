import React, {useState, useEffect} from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { getSingerDetail } from './../../api/singer'

import './index.stylus'
import { ERR_OK } from '../../api/config'

const SingerDetail = function(props) {
	const [show, setShow] = useState(false)
	const [singerDetail, setSingerDetail] = useState([])
	
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
					setSingerDetail(data)
				}
			})
	}, [props.singer.id, props.history])



	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="singer-detail">
				singer detail
				<p>{singerDetail.length}</p>
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