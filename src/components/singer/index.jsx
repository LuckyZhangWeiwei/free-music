import React, {useEffect, useState} from 'react'
import { renderRoutes } from "react-router-config"
import { getSingerList } from './../../api/singer'
import { ERR_OK } from '../../api/config'
import SingerModel from '../../common/js/models/singer'
import ListView from '../../controls/listview'

import './index.stylus'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

function Singer(props) {
	
	const [singers, setSingers] = useState([])

	useEffect(()=> {
		getSingerList().then(res => {
			if (res.code === ERR_OK) {
			  const list =	_normalizeSinger(res.data.list)
				setSingers(list)
			}
		})
	},[])

  return (
		<div className="singer">
			<ListView data={singers} probeType={3} selectItem={onSelectItem} />
			{ renderRoutes(props.route.routes) }
		</div>
  )
	
	function _normalizeSinger(list) {
		let map = {
			hot: {
				title: HOT_NAME,
				items: []
			}
		}

	 list.forEach((item, index) => {
			if (index < HOT_SINGER_LEN) {
				map.hot.items.push(new SingerModel({
					name: item.Fsinger_name,
					id: item.Fsinger_mid
				}))
			}

			const key = item.Findex

			if (!map[key]) {
				map[key] = {
					title: key,
					items: []
				}
			}

			map[key].items.push(new SingerModel({
				name: item.Fsinger_name,
				id: item.Fsinger_mid
			}))
		})

		let hot = []
		let ret = []

		for (let key in map) {
			let val = map[key]
			if (val.title.match(/[a-zA-Z]/)) {
				ret.push(val)
			} else if (val.title === HOT_NAME) {
				hot.push(val)
			}
		}

		ret.sort((a, b) => {
			return a.title.charCodeAt(0) - b.title.charCodeAt(0)
		})

		return hot.concat(ret)
	}
	function onSelectItem(item) {
		const url = `${props.match.url + '/' + item.id}`
 		props.history.push({
			pathname: url
		})
	}
}

export default Singer