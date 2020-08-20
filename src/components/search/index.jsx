import React, {useCallback} from 'react'
import SearchBox from '../../controls/search-box'

import './index.stylus'

function Search() {
	
	const onSearchChanged = useCallback(value => {
		console.log(value)
	}, [])

  return (
    <div className="search">
			<div className="search-box-wrapper">
				<SearchBox placeholder="搜索歌曲、歌手" searchChanged={value => onSearchChanged(value)} />
			</div>
		</div>
  )
}

export default Search