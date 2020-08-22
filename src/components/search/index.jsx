import React, { useState, useCallback, useRef} from 'react'
import { renderRoutes } from "react-router-config"
import SearchBox from '../../controls/search-box'
import HotSearch from './controls/hot-search'
import Suggest from './controls/suggest'

import './index.stylus'

function Search(props) {

	const [selectedHotKey, setSelectedHotKey] = useState('')

	const [query, setQuery] = useState('')

	const searchResultRef = useRef()

	const onSearchChanged = useCallback(value => {
		setQuery(value)
		setSelectedHotKey(value)
	}, [selectedHotKey, query])

	const onHotKeyClicked = useCallback(value => {
		setSelectedHotKey(value)
	}, [selectedHotKey])

  return (
    <div className="search">
			<div className="search-box-wrapper">
				<SearchBox 
					placeholder="搜索歌曲、歌手" 
					selectedHotKey={selectedHotKey} 
					searchChanged={value => onSearchChanged(value)} 
				/>
			</div>
			{
				!query 
				&&
				<div className="shortcut-wrapper">
					<HotSearch title="热门搜索" hotKeyClicked={hotKey => {onHotKeyClicked(hotKey.first)}} />
				</div>
			}
			{
				query
				&&
				<div className="search-result" ref={searchResultRef}>
					<Suggest query={query} {...props} />
				</div>
			}
			{ renderRoutes(props.route.routes) }
		</div>
  )
}

export default Search