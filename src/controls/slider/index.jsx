import React, { useState, useEffect, useRef } from 'react'
import BScroll from 'better-scroll'
import classnames from 'classnames'
import { addClass } from '../../common/js/dom'
import './index.styl'

function Slider(props) {
	
	const { loop, autoPlay, interval } = props
	const [currentPageIndex, setCurrentPageIndex] = useState(0)

	const sliderRef = useRef()
	const sliderGroupRef = useRef()

	let slider = null
	let timer = null

	useEffect(() => {
		_setSliderWidth()
		_initSlider()
		if (autoPlay) {
			_play()
		}
		return () => {
			clearTimeout(timer)
		}
	}, [sliderGroupRef.current, currentPageIndex])

	useEffect(() => {
		window.addEventListener('resize', () => {
			if (!slider) {
				return
			}
			_setSliderWidth(true)
			slider.refresh()
		})
	}, [])
	
	return (
		<div className="slider" ref={sliderRef}>
			<div className="slider-group" ref={sliderGroupRef}>
				{ props.children }
			</div>
			<div className="dots">
				{
					props.children.length 
					&&
					props.children.map((item, index) => {
						return (
							<span key={index} className={classnames('dot', {'active': currentPageIndex === index})}></span>
						)
					})
				}
			</div>
		</div>
	)
	function _setSliderWidth(isResize) {
		let children = sliderGroupRef.current ? sliderGroupRef.current.children : []
		let width = 0
		let sliderWidth = sliderRef.current ? sliderRef.current.clientWidth : 0
		for (let i = 0; i < children.length; i++) {
			let child = children[i]
			addClass(child, 'slider-item')
			child.style.width = sliderWidth + 'px'
			width += sliderWidth
		}

		if (loop && !isResize) {
		  width += 2 * sliderWidth
		}
		sliderGroupRef.current.style.width = width + 'px'
		
	}

	function _initSlider() {
		slider = new BScroll(sliderRef.current, {
				scrollX: true,
				scrollY: false,
				momentum: false,
				snap: {loop: true},
				snapLoop: loop,
				snapThreshold: 0.3,
				snapSpeed: 400
		})
		slider.on('scrollEnd', () => {
			  let pageIndex = slider.getCurrentPage().pageX
        if (loop) {
          pageIndex -= 1
        }
				if (pageIndex === props.children.length) {
					setCurrentPageIndex(0)
				} else {
					setCurrentPageIndex(pageIndex)
				}
        if (autoPlay) {
          clearTimeout(timer)
          _play()
        }
		})
	}

	function _play() {
		let pageIndex = currentPageIndex + 1
		if (loop) {
			pageIndex += 1
		}
		timer = setTimeout(() => {
			slider.goToPage(pageIndex, 0, 400)
		}, interval)
	}

}
export default Slider