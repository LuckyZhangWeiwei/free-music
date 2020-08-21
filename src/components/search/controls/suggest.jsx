import React, {useState, useEffect, useRef, useCallback, memo} from 'react'
import PropTypes from 'prop-types'
import { search } from '../../../api/search'
import { ERR_OK } from '../../../api/config'
import { creatSong } from '../../../common/js/models/song'
import Scroll from '../../../controls/scroll'

import './suggest.stylus'

const TYPE_SINGER = 'singer'

const Suggest = props => {

	const [data, setData] = useState([])

	const scrollRef = useRef()

	useEffect(() => {
		searchSong(props.query)
	}, [props.query])

	const searchSong = useCallback(value => {
		search(value, 1, true, 20).then(res => {
			if (res.code === ERR_OK) {
				setData(_genResult(res.data))
			}
		})
	}, [props.query])

	const _genResult = useCallback(data => {
		let ret = []
		
		if (data.zhida && data.zhida.singerid) {
			ret.push({...data.zhida, ...{type: TYPE_SINGER}})
		}

		if (data.song) {
			ret = ret.concat(_normalizeSongs(data.song.list))
		}
		
		return ret
	}, [props.query])

	const _normalizeSongs = list => {
		let ret = []
		list.forEach(item => {
			if (item.songid && item.albumid) {
				ret.push(creatSong(item))
			}
		})
		return ret
	}

	const getIconCls = item => {
		if (item.type === TYPE_SINGER) {
			return 'icon-mine'
		} else {
			return 'icon-music'
		}
	}

	const getDisplayName = item => {
		if (item.type === TYPE_SINGER) {
			return item.singername
		} else {
			return `${item.name} - ${item.singer}`
		}
	}

	return (
		<Scroll className="suggest" data={data} ref={scrollRef}>
			<ul className="suggest-list">
				{
					data.map((item, index) => {
						return (
								<li className="suggest-item" key={item.songid}>
									<div className="icon">
										<i className={getIconCls(item)} />
									</div>
									<div className="name">
										<p className="text">{getDisplayName(item)}</p>
									</div>
								</li>
						)
					})
				}
			</ul>
		</Scroll>
	)
}

Suggest.propTypes = {
	query: PropTypes.string.isRequired,
}

export default memo(Suggest)