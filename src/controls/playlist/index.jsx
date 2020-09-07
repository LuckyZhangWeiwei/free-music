import React, {memo, useEffect, useState, useRef, useCallback} from 'react'
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Scroll from '../../controls/scroll'
import { setCurrentIndex, setCurrentSong } from '../../store/actions'
import { playMode } from '../../common/js/config'

import './index.stylus'

const MusicListItem = props => {

	const getCurrentIcon = useCallback(item => {
		const currentSong = props.currentSong
		if (currentSong.id === item.id) {
			return 'icon-play'
		} else {
			return ''
		}
	}, [props.currentIndex])

	const selectItem = useCallback((e, item, index) => {
		e.stopPropagation()
		if (props.playMode === playMode.random) {
			index = props.playList.findIndex(song => {
				return song.id === item.id
			})
		}
		props.dispatch(setCurrentIndex(index))
		props.dispatch(setCurrentSong(props.playList[index]))
	}, [])

	return (
			<li className="item" onClick={e => selectItem(e, props.item, props.index)}>
				<i className={`current ${getCurrentIcon(props.item)}`}></i>
				<span className="text">{props.item.name}</span>
				<span className="like">
					<i className="icon-not-favorite"></i>
				</span>
				<span className="delete">
					<i className="icon-delete"></i>
				</span>
			</li>
	)
}

const MusicListItemWithConnect = connect(
	function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(MusicListItem))


const PlayList = props => {
	
	const [show, setShow] = useState(false)

	const scrollRef = useRef(null)

	const listRef = useRef(null)

	useEffect(() => {
		setShow(true)
	}, [])
	
	useEffect(() => {
		scrollToCurrent()
	}, [props.currentSong.id])

	const hidePlaylist = useCallback(e => {
		e.stopPropagation()
		props.hidePlayList()
	}, [])

	const scrollToCurrent = () => {
		const index = props.sequenceList.findIndex(song => {
			return props.currentSong.id === song.id
		})
		
		setTimeout(() => {
				scrollRef.current.scrollToElement(listRef.current.children[index], 300)
		}, 200)
	}

	return (
		<CSSTransition timeout={300} classNames="list-fade" in={show}>
			<div className="playlist" onClick={e => hidePlaylist(e)}>
				<div className="list-wrapper" onClick={e => {e.stopPropagation()}}>
					<div className="list-header">
						<h1 className="title">
							<i className="icon">
								<span className="text"></span>
								<span className="clear"><i className="icon-clear"></i></span>
							</i>
						</h1>
					</div>
					<Scroll className="list-content" data={props.sequenceList} ref={scrollRef}>
						<ul ref={listRef}>
							{
								props.sequenceList.map((item, index) => {
									return (
										<MusicListItemWithConnect 
											key={index} 
											item={item} 
											index={index}
											scrollToCurrent = {() => scrollToCurrent()}
										/>
									)
								})
							}
						
						</ul>
					</Scroll>
					<div className="list-operate">
						<div className="add">
							<i className="icon-add"></i>
							<span className="text">添加歌曲到队列</span>
						</div>
					</div>
					<div className="list-close" onClick={e => hidePlaylist(e)}>
						<span>关闭</span>
					</div>
				</div>
			</div>
		</CSSTransition>
	)
}

export default connect(
	function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(PlayList))