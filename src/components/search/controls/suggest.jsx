import React, {useState, useEffect, useCallback, memo} from 'react'
import PropTypes from 'prop-types'
import { search } from '../../../api/search'

import './suggest.stylus'

const Suggest = props => {
	useEffect(() => {
		searchSong(props.query)
	}, [props.query])

	const searchSong = useCallback(value => {
		search(value, 1, true, 10).then(res => {
			console.log('res:', res)
		})
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