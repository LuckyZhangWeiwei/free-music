import React, { useState, useEffect, useCallback} from 'react'
import SearchBox from '../../controls/search-box'
import HotSearch from './hot-search'

import './index.stylus'

function Search() {

	const [selectedHotKey, setSelectedHotKey] = useState('')

	const onSearchChanged = useCallback(value => {
		console.log(value)
	}, [])

	const onHotKeyClicked = useCallback(value => {
		setSelectedHotKey(value.first)
	}, [])

  return (
    <div className="search">
			<div className="search-box-wrapper">
				<SearchBox placeholder="搜索歌曲、歌手" selectedHotKey={selectedHotKey} searchChanged={value => onSearchChanged(value)} />
			</div>
			<div className="shortcut-wrapper">
				<HotSearch title="热门搜索" hotKeyClicked={hotKey => onHotKeyClicked(hotKey)}></HotSearch>
			</div>
		</div>
  )
}

export default Search