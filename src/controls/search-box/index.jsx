import React, {memo, useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'

import './index.stylus'

const SearchBox = (props) => {

	const [textValue, setTextValue] = useState('')

	const textChange =useCallback(function (e) {
		setTextValue(e.target.value)
	}, [])

	const clearTextBox = useCallback(() => {
		setTextValue('')
	}, [])

	useEffect(() => {
		props.searchChanged(textValue)
	}, [textValue])

	return (
		<div className="search-box">
			<i className="icon-search" />
			<input type="text"
			 className="box" 
			 value={textValue} 
			 placeholder={props.placeholder} 
			 onChange={e => textChange(e)}
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