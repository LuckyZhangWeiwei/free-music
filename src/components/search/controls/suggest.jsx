import React, {useState, useEffect, useRef, useCallback, memo} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { search } from '../../../api/search'
import { ERR_OK } from '../../../api/config'
import { creatSong } from '../../../common/js/models/song'
import Scroll from '../../../controls/scroll'
import NoResult from '../../../controls/no-result'
import Loading from '../../../controls/loading'
import Singer from '../../../common/js/models/singer'
import { setSinger, insertSong } from '../../../store/actions'

import './suggest.stylus'

const TYPE_SINGER = 'singer'
const PAGE_SIZE = 25

const SuggestItem = memo(props => {

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

	const selectItem = useCallback(item => {
		if (item.type === TYPE_SINGER) {
			const singer = new Singer({
				id: item.singermid,
				name: item.singername
			})
			
			const url = `${props.match.url + '/' + singer.id}`

			props.history.push({
				pathname: url
			})

			props.dispatch(setSinger(singer))

		} else {
			props.dispatch(insertSong(item))
		}
	}, [])

	return (
			<li className="suggest-item" onClick={() => {selectItem(props.item)}}>
				<div className="icon">
					<i className={getIconCls(props.item)} />
				</div>
				<div className="name">
					<p className="text">{getDisplayName(props.item)}</p>
				</div>
			</li>
	)
})

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
						setHasMore(false)
					}
				  scrollRef.current &&	scrollRef.current.scrollTo(0, 0)
					pageRef.current = 1
					setData(list)
				}
			}
		})
	}, [data, props.query])

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

	const beforeScroll = () => {
		props.onScroll()
	}

	return (
		<Scroll className="suggest"
		 data={data} 
		 ref={scrollRef} 
		 scrollToEnd={() => onScrollToEnd()} 
		 pullUp={true}
		 beforeScroll={true}
		 onBeforeScroll= {() => beforeScroll()}>
			<ul className="suggest-list">
				{
					data.map((item, index) => {
						return (
							<SuggestItem key={index} item={item} {...props} />
						)
					})
				}
				{
					hasMore && <Loading />
				}
			</ul>
			<div className="no-result-wrapper">
				{
					(data.length === 0 && !hasMore)
					&&
					<NoResult title="暂无搜索结果" />
				}
			</div>
		</Scroll>
	)
}

Suggest.propTypes = {
	query: PropTypes.string.isRequired,
}

export default connect(
	function mapStateToProps(state) {
    return state
  },
	function mapDispatchToProps(dispatch){
		return { dispatch }
})(memo(Suggest))