import React, {useState, useEffect, useRef} from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import { getData } from '../../common/js/dom'


import 'react-lazy-load-image-component/src/effects/blur.css'
import './index.stylus'

const ListView = function (props) {
	const { data } = props
	const scrollRef = useRef()
	const [shortCutList, setShortCutList] = useState([]);

	useEffect(() => {
		const list = data.map(group => {
			return group.title.substr(0, 1)
		})
		setShortCutList(list)
	}, [data])

	return (
		<Scroll className="listview" ref={scrollRef} {...props}>
			<ul>
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
			<div className="list-shortcut" onTouchStart={onShortcutTouchStart}>
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
		console.log(anchorIndex)
		console.log(scrollRef)
	}
}

ListView.propTypes = {
		data: PropTypes.array.isRequired,
}

export default ListView