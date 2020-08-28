import React, { memo } from 'react'
import { connect } from 'react-redux'

import SearchList from '../../../controls/search-list'

const SearchHistory = memo(props => {

	const click = e => {
		e.stopPropagation()
		props.onSearchListDelAll()
	}

	const onItemClick = item => {
		props.onSearchListItemClick(item)
	}

	const onIconClick = item => {
		props.onSearchListIconClick(item)
	}

	return (
		<div className="search-history">
			<h1 className="title">
				<span className="text">{props.title}</span>
				<span className="clear" onClick={e => click(e)}>
					<i className="icon-clear" />
				</span>
			</h1>
			<SearchList 
				itemClick={item => onItemClick(item)}
				iconClick={item => onIconClick(item)}
			/>
		</div>
	)
})

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(SearchHistory)