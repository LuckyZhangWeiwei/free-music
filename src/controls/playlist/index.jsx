import React, {memo, useEffect, useState, useRef, useCallback} from 'react'
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Scroll from '../../controls/scroll'
import { setCurrentIndex, setCurrentSong, delSong } from '../../store/actions'
import { playMode } from '../../common/js/config'
import Confirm from '../../controls/confirm'
import { clearList } from '../../store/actions'

import './index.stylus'

const MusicListItem = props => {

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

	const deleteItem = useCallback((e, item) => {
		e.stopPropagation()
		props.dispatch(delSong(item))
	}, [])

	return (
			<li className="item" onClick={e => selectItem(e, props.item, props.index)}>
				<i className={classnames('current', {'icon-play': props.currentSong.id === props.item.id})} />
				<span className="text">{props.item.name}</span>
				<span className="like">
					<i className="icon-not-favorite"></i>
				</span>
				<span className="delete" onClick={e => deleteItem(e, props.item)}>
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

const ListHeader = memo(props => {

	const clearAll = useCallback(e => {
		e.stopPropagation()
		props.showConfirm()
	}, [])

	return (
			<div className="list-header">
				<h1 className="title">
					<i className="icon">
						<span className="text"></span>
						<span className="clear" onClick={e => clearAll(e)}><i className="icon-clear" /></span>
					</i>
				</h1>
			</div>
	)
})

const CloseButton = memo(props => {
	
	const hidePlaylist = useCallback(e => {
		e.stopPropagation()
		props.hidePlaylist()
	}, [])

	return (
		<div className="list-close" onClick={e => hidePlaylist(e)}>
			<span>{props.text}</span>
		</div>
	)
})


const PlayList = props => {
	
	const [show, setShow] = useState(false)

	const [showConfirm, setShowConfirm] = useState(false)

	const scrollRef = useRef(null)

	const listRef = useRef(null)

	useEffect(() => {
		setShow(true)
	}, [])
	
	useEffect(() => {
		scrollToCurrent()
	}, [props.currentSong.id])

	const hidePlaylist = useCallback(() => {
		props.hidePlayList()
	}, [])

	const scrollToCurrent = () => {
		const index = props.sequenceList.findIndex(song => {
			return props.currentSong.id === song.id
		})
		
		setTimeout(() => {
			!!scrollRef.current &&
				scrollRef.current.scrollToElement(listRef.current.children[index], 300)
		}, 200)
	}

	const onShowConfirm = useCallback(() => {
		setShowConfirm(true)
	}, [])

	const confrimCancel = useCallback(() => {
		setShowConfirm(false)
	}, [])

	const confirmOk = useCallback(() => {
	 props.dispatch(clearList())
		setShowConfirm(false)
	}, [])

	return (
		<>
			<CSSTransition timeout={300} classNames="list-fade" in={show}>
				<div className="playlist" onClick={e => hidePlaylist(e)}>
					<div className="list-wrapper" onClick={e => {e.stopPropagation()}}>
						<ListHeader showConfirm={() => onShowConfirm()} />
						<Scroll 
							className="list-content" 
							data={props.sequenceList} 
							ref={scrollRef}>
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
				  	<CloseButton text="关闭" hidePlaylist={() => hidePlaylist()} />
					</div>
				</div>
			</CSSTransition>
			{
			  !!showConfirm &&
				<Confirm 
					text="确定删除所有的记录吗？"
					show={showConfirm}
					onClickCancel={() => confrimCancel()}
					onClickOk={() => confirmOk()}/>
			}
		</>
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