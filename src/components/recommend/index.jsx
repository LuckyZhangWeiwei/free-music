import React, { useEffect, useState } from 'react'
import { getRecommend } from '../../api/recommend'
import { ERR_OK } from '../../api/config'
import Slider from '../../controls/slider'

function Recommend() {
	
	const [slider, setSlider] = useState([])

	useEffect(() => {
		getRecommend()
			.then(res => {
				if (res.code === ERR_OK) {
					const { slider } = res.data
					console.log(slider)
					setSlider(slider)
				}
			})
	}, [])

  return (
    <div className="slider-wrapper">
				<Slider loop={true} interval={4000} autoPlay={true}>
					{
						slider.length > 0 
						&&
						slider.map(item=>{
							return (
								<div key={item.id}>
									<a href={item.linkUrl}>
										<img src={item.picUrl} className="needsclick" />
									</a>
								</div>
							)
						})
					}					
				</Slider>
		</div>
  )
}

export default Recommend