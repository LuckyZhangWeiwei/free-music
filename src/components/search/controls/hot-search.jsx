import React, {useState, useEffect, useCallback, memo} from 'react'
import { getHotSearchTag } from '../../../api/search'
import { ERR_OK_lOCAL } from '../../../api/config'

const HotSearch = function (props) {

	const [tags, setTags] = useState([])

	useEffect(() => {
		getHotSearchTag().then(res => {
			if (res.code === ERR_OK_lOCAL) {
				setTags(res.result.hots)
			}
		})
	}, [])

	const onHotKeyClicked = useCallback(item => {
		props.hotKeyClicked(item)
	}, [])

	return (
		<div className="shortcut">
			<div className="hot-key">
				<h1 className="title">{props.title}</h1>
				<ul>
					{
						tags.map((item) => {
						 return	<li className="item" key={item.first} onClick={() => onHotKeyClicked(item)} >{item.first}</li>
						})
					}
				</ul>
			</div>
		</div>
	)
}

export default memo(HotSearch)