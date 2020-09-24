import React, {useState, useEffect, memo, useRef, useCallback}  from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import RandomPlay from '../../controls/random-play'
import ScrollList from './../../controls/scroll-list'
import { insertSong } from '../../store/actions'
import { Song } from '../../common/js/models/song'

import './index.stylus'

import Switches from '../../controls/switches'

function UserCenter(props) {
	const [show, setShow] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [switcheNames, setSwitchNames] = useState([{name: '我喜欢的'},{name: '最近听的'}])
	
	const playBtnRef = useRef(null)
	const listWrapperRef = useRef(null)

	useEffect(() => {
		setShow(true)
	}, [])

	const switchItem = useCallback(index => {
		setCurrentIndex(index)
	}, [])

	const favoriteListClick = useCallback((song, index) => {
		props.dispatch(insertSong(new Song(song)))
	}, [props.currentSong.id])

	const historyListClick = useCallback((song, index) => {
		props.dispatch(insertSong(new Song(song)))
	}, [props.currentSong.id])

  return (
    <CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="user-center">
				<div className="back" onClick={() => props.history.goBack()}>
					<i className="icon-back"></i>
				</div>
				<div className="switches-wrapper">
					<Switches 
						switches={switcheNames} 
						currentIndex={currentIndex} 
						onSwitchItem={index => switchItem(index)} />
				</div>
				<RandomPlay 
					text="随机播放全部" 
					playWrapperRef={playBtnRef}
					song={currentIndex === 0 ? props.favoriteList : props.playHistory}
				/>
				<div className="list-wrapper" ref={listWrapperRef}>
						{
								currentIndex === 0 ?
								 <ScrollList
										data={props.favoriteList}
										select={(song, index) => favoriteListClick(song, index)}
									/>
									:
								 <ScrollList
										data={props.playHistory}
										select={(song, index) => historyListClick(song, index)}
									/>
								}
				</div>
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
})(memo(UserCenter))