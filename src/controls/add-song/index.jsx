import React, { useState, useEffect, useRef, memo, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import SearchBox from '../../controls/search-box'
import Suggest from '../../components/search/controls/suggest'
import { setSearchHistory } from '../../store/actions'
import './index.stylus'

const AddSong = props => {
	const [show, setShow] = useState(false)

	const [query, setQuery] = useState('')

	const searchBoxRef = useRef(null)

	useEffect(() => {
		setShow(true)
	}, [])

	const close = useCallback(e => {
		e.stopPropagation()
		props.closeAddSong()
	}, [])

	const onSearchChanged = useCallback(value => {
		if(!value) return
		setQuery(value)
	}, [query])

	const onScroll = useCallback(() => {
		searchBoxRef.current.blur()
	}, [])

	const selectSuggestItem = useCallback(() => {
		props.dispatch(setSearchHistory(query))
	}, [query, props.searchHistory])

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="add-song">
				<div className="header">
					<h1 className="title">添加歌曲到列表</h1>
					<div className="close" onClick={e => close(e)}>
						<i className="icon-close"></i>
					</div>
				</div>
				<div className="search-box-wrapper">
					<SearchBox 
						placeholder="搜素歌曲"
						ref={searchBoxRef}
						searchChanged={value => onSearchChanged(value)} 
					/>
				</div>
				{
					!!query ?
					<div className="search-result">
						<Suggest
							query={query}
							showSinger={false}
							onScroll={() => onScroll()} 
							select={item => {selectSuggestItem(item)}} 
						/>
					</div>
					:
					<div className="shortcut"></div>
				}
			</div>
		</CSSTransition>
	)
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(AddSong))