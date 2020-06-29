import React, { useEffect, useState, useRef } from 'react'
import { getRecommend, getDiscList } from '../../api/recommend'
import { ERR_OK, ERR_OK_lOCAL } from '../../api/config'
import Slider from '../../controls/slider'
import './index.stylus'

function Recommend() {
	
	const [slider, setSlider] = useState([])
	const [discList, setDiscList] = useState([])

	const recommendRef = useRef()

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
				console.log(playlists)
			}
		})
	}, [])

  return (
		<div className="recommend" ref={recommendRef}>
			<div className="recommend-content">
						<div>
							<div className="slider-wrapper">
								<Slider loop={true} interval={4000} autoPlay={true}>
									{
										slider.length > 0 
										&&
										slider.map(item=>{
											return (
												<div key={item.id}>
													<a href={item.linkUrl}>
														<img src={item.picUrl} alt="" className="needsclick" />
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
												<li className="item" key={item.id}>
													 <div className="icon">
															<img width="60" height="60" alt="" src={item.coverImgUrl} />
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
			</div>
		</div>
  )
}

export default Recommend