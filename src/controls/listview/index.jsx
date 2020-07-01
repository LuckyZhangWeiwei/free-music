import React, {useState, useEffect, useRef} from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import { getData } from '../../common/js/dom'


import 'react-lazy-load-image-component/src/effects/blur.css'
import './index.stylus'

const ListView = function (props) {
	const { data } = props

	const ANCHOR_HEIGHT = 18

	const scrollRef = useRef()
	const listGroupRef = useRef()

	const touch = {}

	const [shortCutList, setShortCutList] = useState([]);

	useEffect(() => {
		const list = data.map(group => {
			return group.title.substr(0, 1)
		})
		setShortCutList(list)
	}, [data])

	return (
		<Scroll className="listview" ref={scrollRef} {...props}>
			<ul ref={listGroupRef}>
			{
				data.map((group, index) => {
					return (
						<li className="list-group" key={group.title}>
							<h2 className="list-group-title">{group.title}</h2>
							<ul>
								{
									group.items.map((item, index) => {
										return (
											<li className="list-group-item" key={item.name}>
												<LazyLoadImage className="avatar" src={item.avatar} alt={item.name} effect="blur" />
												<span className="name">{item.name}</span>
											</li>
										)
									})
								}
							</ul>
						</li>
						)
					})
				}
			</ul>
			<div className="list-shortcut" onTouchStart={onShortcutTouchStart} onTouchMove={onShortcutTouchMove}>
				<ul>
					{
						shortCutList.map((item, index) => {
							return (
								<li className="item" key={item} data-index={index}>{item}</li>
							)
						})
					}
				</ul>
			</div>
		</Scroll>
	)

	function onShortcutTouchStart(e) {
		let anchorIndex = getData(e.target, 'index')
		let firstTouch = e.touches[0]
		touch.y1 = firstTouch.pageY
		touch.anchorIndex = anchorIndex
		_scrollTo(anchorIndex)
	}

	function onShortcutTouchMove(e) {
		e.stopPropagation()
		let nextTouch = e.touches[0]
		touch.y2 = nextTouch.pageY
		let delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
		let anchorIndex = parseInt(touch.anchorIndex) + delta
		_scrollTo(anchorIndex)
	}

	function _scrollTo(index) {
		const group =	listGroupRef.current.children
		const touchedGroup = Array.from(group)[index]
		scrollRef.current.scrollToElement(touchedGroup, 0)
	}
}

ListView.propTypes = {
		data: PropTypes.array.isRequired,
}

export default ListView