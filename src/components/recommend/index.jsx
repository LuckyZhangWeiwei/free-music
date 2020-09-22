import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { renderRoutes } from "react-router-config"
import { connect } from 'react-redux'
import { getRecommend, getDiscList } from '../../api/recommend'
import { ERR_OK, ERR_OK_lOCAL } from '../../api/config'
import Slider from '../../controls/slider'
import Scroll from '../../controls/scroll'
import Loading from '../../controls/loading'
import { setDisc } from '../../store/actions'

import './index.stylus'
import 'react-lazy-load-image-component/src/effects/blur.css'

function Recommend(props) {
	
	const checkLoadedRef = useRef(false)

	const recommendlistRef = useRef()

	const [slider, setSlider] = useState([])

	const [discList, setDiscList] = useState([])

	const scrollRef = useRef()

	useEffect(() => {
		getRecommend()
			.then(res => {
				if (res.code === ERR_OK) {
					const { slider } = res.data
					setSlider(slider)
				}
			})

		getDiscList().then(res => {
			if (res.code === ERR_OK_lOCAL) {
				const { playlists } = res
				setDiscList(playlists)
			}
		})
	}, [])

	/********************************************* */
	useEffect(() => {
		if (props.currentIndex === -1) {
			return
		}
		recommendlistRef.current.style['margin-bottom'] = '60px'
		scrollRef.current.refresh()
	}, [props.currentIndex])
	/********************************************* */

	const loadImage = useCallback(function () {
		if (!checkLoadedRef.current) {
			scrollRef.current.refresh()
			checkLoadedRef.current = true
		}
	}, [])

	const selectItem = useCallback(function(item) {
		const url = `${props.match.url + '/' + item.id}`
 		props.history.push({
			pathname: url
		})
		props.dispatch(setDisc(item))
	}, [])

  return (
		<div className="recommend" ref={recommendlistRef}>
			 <Scroll className="recommend-content" data={discList}  ref={scrollRef}>
					<div>
						<div className="slider-wrapper" style={{ maxHeight:165, minHeight: 165 }} >
							<Slider loop={true} interval={4000} autoPlay={true}>
								{
									slider.length > 0 
									&&
									slider.map(item=>{
										return (
											<div key={item.id}>
												<a href={item.linkUrl}>
													<img 
														alt={item.id} 
														src={item.picUrl} 
														onLoad={loadImage} 
														className="needsclick slider-image" />
												</a>
											</div>
										)
									})
								}					
							</Slider>
						</div>
						<div className="recommend-list">
							<h1 className="list-title">
									热门歌单推荐
							</h1>
							<ul>
								{
									discList.map((item, index) => {
										return (
											<li className="item" key={item.id} onClick={() => selectItem(item)}>
													<div className="icon">
														<LazyLoadImage
															alt=""
															height={60}
															effect="blur"
															src={item.coverImgUrl} // use normal <img> attributes as props
															width={60} />
													</div>
													<div className="text">
														<h2 className="name">{item.creator.nickname}</h2>
														<p className="desc">{item.name}</p>
													</div>
											</li>
										)
									}) 
								}
							</ul>
						</div>
				</div>
				{
					!discList.length 
					&&
					<div className="loading-container">
						<Loading title="正在加载..."/>
					</div>
				}
			</Scroll>
			{ renderRoutes(props.route.routes) }
		</div>
  )
}

export default connect(
	function mapStateToProps(state) {
    return state
  },
	function mapDispatchToProps(dispatch){
		return { dispatch }
})(memo(Recommend))