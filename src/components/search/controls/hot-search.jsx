import React, {useState, useEffect, useCallback, memo} from 'react'
import PropTypes from 'prop-types'
import { getHotSearchTag } from '../../../api/search'
import { ERR_OK_lOCAL } from '../../../api/config'
import Scroll from '../../../controls/scroll'

const HotSearch = props => {

	const [tags, setTags] = useState([])

	const [data, setData] = useState([])

	useEffect(() => {
		setData(data.concat(tags).concat(props.searchHistory))
	}, [tags])

	useEffect(() => {
		console.log('props.searchHistory:', props.searchHistory)
		getHotSearchTag().then(res => {
			if (res.code === ERR_OK_lOCAL) {
				setTags(res.result.hots)
			}
		})
		return () => {
			setTags([])
		}
	}, [])

	const onHotKeyClicked = useCallback(item => {
		props.hotKeyClicked(item)
	}, [])

	return (
		<Scroll className="shortcut" data={data}>
			<div>
					<div className="hot-key">
						<h1 className="title">{props.title}</h1>
						<ul>
							{
								tags.map(item => {
								return	<li 
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

export default memo(HotSearch)