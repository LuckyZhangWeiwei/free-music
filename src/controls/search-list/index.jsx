import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'

import './index.stylus'

const ItemLine = memo(props => {
	const select = e => {
		e.stopPropagation()
		console.log('e', e)
	}

	return (
		<li className="search-item">
			<span className="text">{props.item}</span>
			<span className="icon" onClick={e => select(e)}>
				<i className="icon-delete" />
			</span>
		</li>
	)
})

const SearchList = memo(props => {
	return (
		<div className="search-list">
			{
				props.searchHistory.map((item, index) => {
					return (
						<ItemLine key={item} item={item} />
					)
				})
			}
		</div>
	)
})

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(SearchList)