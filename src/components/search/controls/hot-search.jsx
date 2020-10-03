import React, {useState, useEffect, useCallback, useRef, memo} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getHotSearchTag } from '../../../api/search'
import { ERR_OK_lOCAL } from '../../../api/config'
import Scroll from '../../../controls/scroll'

const HotSearch = props => {

	const [tags, setTags] = useState([])

	const [data, setData] = useState([])

	const scrollRef = useRef(null)

	useEffect(() => {
		setData(tags.concat(props.searchHistory))
		setTimeout(() => {
			!!scrollRef.current && scrollRef.current.refresh()	
		}, 20)
	}, [tags, props.searchHistory])

	useEffect(() => {
		getHotSearchTag().then(res => {
			if (res.code === ERR_OK_lOCAL) {
				setTags(res.result.hots)
			}
		})
		return () => {
			setTags([])
		}
	}, [])

	useEffect(()=>{
		setTimeout(() => {
			!!scrollRef.current && scrollRef.current.refresh()	
		}, 20)
	}, [props.selectedHotKey])

	const onHotKeyClicked = useCallback(item => {
		props.hotKeyClicked(item)
	}, [])

	return (
		<Scroll className="shortcut" data={data} ref={scrollRef}>
			<div>
				<div className="hot-key">
					<h1 className="title">{props.title}</h1>
					<ul>
						{
							tags.map(item => {
							return <li 
											className="item" 
											key={item.first} 
											onClick={() => onHotKeyClicked(item)}>
												{item.first}
										</li>
							})
						}
					</ul>
				</div>
				{
					props.children
				}
			</div>
		</Scroll>
	)
}

HotSearch.propTypes = {
	title: PropTypes.string,
	hotKeyClicked: PropTypes.func.isRequired
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(memo(HotSearch))