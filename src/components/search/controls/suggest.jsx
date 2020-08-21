import React, {useState, useEffect, useRef, useCallback, memo} from 'react'
import PropTypes from 'prop-types'
import { search } from '../../../api/search'
import { ERR_OK } from '../../../api/config'
import { creatSong } from '../../../common/js/models/song'
import Scroll from '../../../controls/scroll'
import Loading from '../../../controls/loading'

import './suggest.stylus'

const TYPE_SINGER = 'singer'
const PAGE_SIZE = 25

const Suggest = props => {

	const [data, setData] = useState([])

	const scrollRef = useRef()

	const pageRef = useRef(1)

	const [hasMore, setHasMore] = useState(true)

	const [pageObj, setPageObj] = useState({})


	useEffect(() => {
		searchSong(true)
	}, [props.query])

	useEffect(() => {
		_checkMore()
	}, [data, props.query])

	const searchSong = useCallback((isInit = true) => {
		setHasMore(true)
		search(props.query, pageRef.current, true, PAGE_SIZE).then(res => {
			if (res.code === ERR_OK) {
				const resData = res.data
				setPageObj(resData)
				const list = _genResult(resData)
				if (!isInit) {
					setData(data.concat(list))
				} else {
					if(list.length === 0) {
						console.log(list)
						setHasMore(false)
					}
				  scrollRef.current &&	scrollRef.current.scrollTo(0, 0)
					pageRef.current = 1
					setData(list)
				}
			}
		})
	}, [data])

	const _checkMore = useCallback(() => {
		if (!pageObj.song || pageObj.song.list.length <= 0) {
			return
		}
		const song = pageObj.song
		if (!song.list.length || (song.curnum + song.curpage * PAGE_SIZE) > song.totalnum) {
			setHasMore(false)
		}
	}, [data, pageRef.current])

	const _genResult = useCallback(data => {
		let ret = []
		
		if (data.zhida && data.zhida.singerid) {
			ret.push({...data.zhida, ...{type: TYPE_SINGER}})
		}

		if (data.song) {
			ret = ret.concat(_normalizeSongs(data.song.list))
		}
		
		return ret
	}, [data])

	const _normalizeSongs = useCallback(list => {
		let ret = []
		list.forEach(item => {
			if (item.songid && item.albumid) {
				ret.push(creatSong(item))
			}
		})
		return ret
	}, [data])

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

	const onScrollToEnd = () => {
		searchMore()
	}

	// const searchMore = useCallback(() => {
	// 	if (!hasMore) {
	// 		return
	// 	}
	// 	pageRef.current = pageRef.current + 1
	// 	searchSong(false)
	// }, [props.query, pageRef.current])

	const searchMore = () => {
		if (!hasMore) {
			return
		}
		pageRef.current = pageRef.current + 1
		searchSong(false)
	}

	return (
		<Scroll className="suggest"
		 data={data} 
		 ref={scrollRef} 
		 scrollToEnd={() => onScrollToEnd()} 
		 pullUp={true}>
			<ul className="suggest-list">
				{
					data.map((item, index) => {
						return (
								<li className="suggest-item" key={item.id}>
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
				{
					hasMore &&
					<Loading />
				}
			</ul>
		</Scroll>
	)
}

Suggest.propTypes = {
	query: PropTypes.string.isRequired,
}

export default memo(Suggest)