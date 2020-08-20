import React, {useState, useEffect, useCallback, memo} from 'react'
import PropTypes from 'prop-types'

import './suggest.stylus'

const Suggest = props => {
	useEffect(() => {
		search(props.query)
	}, [props.query])

	const search = useCallback(value => {
		
	}, [props.query])

	return (
		<div className="suggest">
			<ul className="suggest-list">
				<li className="suggest-item">
					<div className="icon">
						<i></i>
					</div>
					<div className="name">
						<p className="text"></p>
					</div>
					</li>
			</ul>
		</div>
	)
}

Suggest.propTypes = {
	query: PropTypes.string.isRequired,
}

export default memo(Suggest)