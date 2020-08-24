import React, {memo, useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import { debounce } from '../../common/js/util'

import './index.stylus'

const SearchBox = (props) => {

	const [textValue, setTextValue] = useState(props.selectedHotKey || '')

	const textChange =useCallback(function (e) {
		setTextValue(e.target.value)
	}, [])

	const clearTextBox = useCallback(() => {
		setTextValue('')
	}, [])

	useEffect(() => {
	//  debounce(
	// 	 () => props.searchChanged(textValue),
	//    200
	//  )
		props.searchChanged(textValue)
	}, [textValue])

	useEffect(() => {
		setTextValue(props.selectedHotKey)
	}, [props.selectedHotKey])

	return (
		<div className="search-box">
			<i className="icon-search" />
			<input type="text"
			 className="box" 
			 value={textValue} 
			 placeholder={props.placeholder} 
			 onChange={e => textChange(e)}
			 ref={props.myRef}
			/>
			{
				textValue && <i className="icon-dismiss" onClick={() => clearTextBox()} />
			}
		</div>
	)
}

SearchBox.propTypes = {
	placeholder: PropTypes.string,
	searchChanged: PropTypes.func
}

export default memo(SearchBox)