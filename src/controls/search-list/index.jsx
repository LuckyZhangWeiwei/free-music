import React, { memo, useCallback } from 'react'
import { connect } from 'react-redux'

import './index.stylus'

const ItemLine = memo(props => {
	
	const clickIcon = useCallback(e => {
		e.stopPropagation()
		props.onIconClick(props.item)
	}, [props.item])

	const itemLineClick = useCallback((e) => {
		props.onItemclick(props.item)
	}, [props.item])


	return (
		<li className="search-item" onClick={e => itemLineClick(e)}>
			<span className="text">{props.item}</span>
			<span className="icon" onClick={e => clickIcon(e)}>
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
						<ItemLine 
							key={item} 
							item={item} 
							onItemclick={item => props.itemClick(item)} 
							onIconClick={item => props.iconClick(item)} 
						/>
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