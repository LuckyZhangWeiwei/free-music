import React, { useState, useEffect, useRef, memo, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import SearchBox from '../../controls/search-box'
import Suggest from '../../components/search/controls/suggest'
import Switches from '../../controls/switches'
import { setSearchHistory, delSearchHistoryItem } from '../../store/actions'
import RecentPlayList from './constrols/recentPlayList'
import HistorySearchList from './constrols/historySearchList'
import './index.stylus'

const AddSong = props => {
	const [show, setShow] = useState(false)

	const [query, setQuery] = useState('')

	const [selectedHotKey, setSelectedHotKey] = useState('')

	const [switchesObj, setSwitchesObj] = useState({
		currentIndex: 0,
		list:[
			{name: '最近播放'},
			{name: '搜索历史'}
			]
	})

	const searchBoxRef = useRef(null)

	const recentPlayListRef = useRef(null)

	const playHistoryRef = useRef(null)

	useEffect(() => {
		setShow(true)
	}, [])

	useEffect(() => {
		setTimeout(() => {
			if (switchesObj.currentIndex === 0) {
				recentPlayListRef.current.refresh()
			} else {
				playHistoryRef.current.refresh()
			}
		}, 20)
	}, [switchesObj.currentIndex])

	const close = useCallback(e => {
		e.stopPropagation()
		props.closeAddSong()
	}, [])

	const onSearchChanged = useCallback(value => {
		setQuery(value)
	}, [query])

	const onScroll = useCallback(() => {
		searchBoxRef.current.blur()
	}, [])

	const selectSuggestItem = useCallback(() => {
		props.dispatch(setSearchHistory(query))
	}, [query, props.searchHistory])

	const switchItem = currentIndex => {
		switchesObj.currentIndex = currentIndex
		let obj = Object.assign({}, switchesObj)
		setSwitchesObj(obj)
	}

	const selectHistoryItem = useCallback(item => {
		setSelectedHotKey(item)
	}, [selectedHotKey])

	const selectHistoryIcon = item => {
		props.dispatch(delSearchHistoryItem(item))
	}

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="add-song">
				<div className="header">
					<h1 className="title">添加歌曲到列表</h1>
					<div className="close" onClick={e => close(e)}>
						<i className="icon-close"></i>
					</div>
				</div>
				<div className="search-box-wrapper">
					<SearchBox 
						placeholder="搜素歌曲"
						ref={searchBoxRef}
						searchChanged={value => onSearchChanged(value)}
						selectedHotKey={selectedHotKey} 
					/>
				</div>
				{
					!!query ?
					<div className="search-result">
						<Suggest
							query={query}
							showSinger={false}
							onScroll={() => onScroll()} 
							select={item => {selectSuggestItem(item)}} 
						/>
					</div>
					:
					<div className="shortcut">
						<Switches
							currentIndex={switchesObj.currentIndex} 
							switches={switchesObj.list}
							onSwitchItem={switchItem} />
							<div className="list-wrapper">
								{
									switchesObj.currentIndex === 0 ?
									<RecentPlayList
										myRef={recentPlayListRef}
										playHistory={props.playHistory} />
									:
									<HistorySearchList
										myRef={playHistoryRef}
										searchHistory={props.searchHistory} 
										onClickItem={item => selectHistoryItem(item)}
										onClickIcon={item => selectHistoryIcon(item)}
									/>
								}
							</div>
					</div>
				}
			</div>
		</CSSTransition>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(AddSong))