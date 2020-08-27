import React, { memo } from 'react'
import { connect } from 'react-redux'

import SearchList from '../../../controls/search-list'

const SearchHistory = memo(props => {

	const click = e => {
		e.stopPropagation()
		console.log('e', e)
	}

	return (
		<div className="search-history">
			<h1 className="title">
				<span className="text">{props.title}</span>
				<span className="clear" onClick={e => click(e)}>
					<i className="icon-clear" />
				</span>
			</h1>
			<SearchList />
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