import React, { useState, useCallback, useRef, memo} from 'react'
import { renderRoutes } from "react-router-config"
import { connect } from 'react-redux'
import SearchBox from '../../controls/search-box'
import HotSearch from './controls/hot-search'
import Suggest from './controls/suggest'
import { setSearchHistory } from '../../store/actions'
import SearchHistory from './controls/search-history'

import './index.stylus'

function Search(props) {

	const [selectedHotKey, setSelectedHotKey] = useState('')

	const [query, setQuery] = useState('')

	const searchBoxRef = useRef()
	

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
	}, [])

  return (
    <div className="search">
			<div className="search-box-wrapper">
				<SearchBox
				  myRef={searchBoxRef}
					placeholder="搜索歌曲、歌手" 
					selectedHotKey={selectedHotKey} 
					searchChanged={value => onSearchChanged(value)} 
				/>
			</div>
			{
				!query 
				&&
				<div className="shortcut-wrapper">
					<HotSearch title="热门搜索" hotKeyClicked={hotKey => {onHotKeyClicked(hotKey.first)}}>
						{
							props.searchHistory.length > 0
							&&
							<SearchHistory title="搜索历史" />
						}
					</HotSearch>
				</div>
			}
			{
				query
				&&
				<div className="search-result">
					<Suggest query={query} {...props} onScroll={() => onScroll()} select={item => {setToSearchHistory(item)}} />
				</div>
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