import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'

import './index.stylus'

const SearchList = memo(props => {

	const select = e => {
		e.stopPropagation()
		console.log('e', e)
	}
	return (
		<div class="search-list">
			{
				props.searchHistory.map((item, index) => {
					return (
							<li class="search-item" key={item}>
								<span class="text">{item}</span>
								<span class="icon">
									<i class="icon-delete" onClick={e => select(e)} />
								</span>
							</li>
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

// export default SearchList