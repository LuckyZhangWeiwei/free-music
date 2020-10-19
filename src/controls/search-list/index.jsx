import React, { memo, useCallback } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
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
				<TransitionGroup>
					{
						props.searchHistory.map(item =>
							<CSSTransition key={item} timeout={300} classNames="item">
								<ItemLine
									item={item} 
									onItemclick={item => props.itemClick(item)} 
									onIconClick={item => props.iconClick(item)} 
								/>
							</CSSTransition>
						)}
				</TransitionGroup>
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