import React, { useEffect, useState, useCallback, useRef, memo} from 'react'
import { renderRoutes } from "react-router-config"
import { connect } from 'react-redux'
import SearchBox from '../../controls/search-box'
import HotSearch from './controls/hot-search'
import Suggest from './controls/suggest'
import { setSearchHistory, delSearchHistoryItem, delSearchHistoryAll } from '../../store/actions'
import SearchHistory from './controls/search-history'
import Confirm from '../../controls/confirm'

import './index.stylus'

function Search(props) {

	const [selectedHotKey, setSelectedHotKey] = useState('')

	const [query, setQuery] = useState('')

	const [showConfirm, setShowConfirm] = useState(false)

	const searchBoxRef = useRef(null)

	const suggestListRef = useRef(null)

	const containerRef = useRef(null)

	/********************************************* */
	useEffect(() => {
		if (props.currentIndex === -1) {
			return
		}
		if (!!suggestListRef.current)
	  	suggestListRef.current.style['margin-bottom'] = '60px'
		containerRef.current.style['margin-bottom'] = '60px'
	}, [props.currentSong && props.currentSong.id])
	/********************************************* */

	const onSearchChanged = useCallback(value => {
		setQuery(value)
		setSelectedHotKey(value)
	}, [selectedHotKey, query])

	const onHotKeyClicked = useCallback(value => {
		setSelectedHotKey(value)
	}, [selectedHotKey])

	const onScroll = useCallback(() => {
		searchBoxRef.current.blur()
	}, [])

	const setToSearchHistory = useCallback(() => {
		props.dispatch(setSearchHistory(query))
	}, [query, props.searchHistory])

	const delAllHistory = () => {
		setShowConfirm(true)
	}

	const searchListItemClick = useCallback(item => {
		setSelectedHotKey(item)
	}, [selectedHotKey])

	const searchListIconClick = useCallback(item => {
		props.dispatch(delSearchHistoryItem(item))
	}, [])

	const confrimCancel = useCallback(() => {
		setShowConfirm(false)
	}, [])

	const confirmOk = () => {
		props.dispatch(delSearchHistoryAll())
		setShowConfirm(false)
	}

  return (
    <div className="search">
			<div className="search-box-wrapper">
				<SearchBox
					ref={searchBoxRef}
					placeholder="搜索歌曲、歌手" 
					selectedHotKey={selectedHotKey} 
					searchChanged={value => onSearchChanged(value)} 
				/>
			</div>
			<div 
				className="shortcut-wrapper" 
				style={{display: !query ? "block":"none"}}
				ref={containerRef}
			>
				<HotSearch
					title="热门搜索"
					selectedHotKey={selectedHotKey}
					hotKeyClicked={hotKey => onHotKeyClicked(hotKey.first)}>
					{
						props.searchHistory.length ?
						<SearchHistory 
							title="搜索历史"
							onSearchListDelAll={() => delAllHistory()}
							onSearchListItemClick={item => searchListItemClick(item)}
							onSearchListIconClick={item => searchListIconClick(item)}
						/>
						:
						null
					}
				</HotSearch>
			</div>
			{
				query
				&&
				<div className="search-result" ref={suggestListRef}>
					<Suggest 
						query={query} 
						{...props} 
						onScroll={() => onScroll()} 
						select={item => {setToSearchHistory(item)}} 
					/>
				</div>
			}
			{
				showConfirm &&
				<Confirm text="确定删除所有的历史记录吗？"
					show={showConfirm}
					onClickCancel={() => confrimCancel()}
					onClickOk={() => confirmOk()} />
			}
			
			{ renderRoutes(props.route.routes) }
		</div>
  )
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(Search))