import React, { useEffect, useState, useRef, useCallback, memo } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { renderRoutes } from "react-router-config"
import { connect } from 'react-redux'
import { getRecommend, getDiscList } from '../../api/recommend'
import { ERR_OK_lOCAL } from '../../api/config'
import Slider from '../../controls/slider'
import Scroll from '../../controls/scroll'
import Loading from '../../controls/loading'
import { setDisc, setBanner, setDiscList } from '../../store/actions'

import './index.stylus'
import 'react-lazy-load-image-component/src/effects/blur.css'

function Recommend(props) {
	
	const checkLoadedRef = useRef(false)

	const recommendlistRef = useRef()

	const scrollRef = useRef()

	useEffect(() => {
		if (props.banners.length === 0) {
			getRecommend()
			.then(res => {
				if (res.code === ERR_OK_lOCAL) {
					const slider = res.data
					props.dispatch(setBanner(slider))
				}
			})
		}
		if (props.discList.length === 0) {
			getDiscList().then(res => {
				if (res.code === ERR_OK_lOCAL) {
					const { playlists } = res
					props.dispatch(setDiscList(playlists))
				}
			})
		}
		
	}, [!!props.banners && props.banners.length])

	/********************************************* */
	useEffect(() => {
		if (props.currentIndex === -1) {
			return
		}
		if (props.currentSong && props.currentSong.id) {
			recommendlistRef.current.style['margin-bottom'] = '60px'
		} else {
			recommendlistRef.current.style['margin-bottom'] = '0px'
		}
	}, [props.currentSong && props.currentSong.id])
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
			 <Scroll className="recommend-content" data={props.discList}  ref={scrollRef}>
					<div>
						<div className="slider-wrapper" style={{ maxHeight:165, minHeight: 165 }} >
							<Slider loop={true} interval={4000} autoPlay={true}>
								{
									!!props.banners
									&&
									props.banners.map(item=> {
										return (
											<div key={item.targetId}>
												<a href={item.url}>
													<img 
														alt={item.typeTitle} 
														src={item.pic} 
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
									props.discList.map((item, index) => {
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
					!props.discList.length 
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