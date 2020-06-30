import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Scroll from '../scroll'

import PropTypes from 'prop-types'

import 'react-lazy-load-image-component/src/effects/blur.css'
import './index.stylus'

const ListView = function (props) {
	const { data } = props
	return (
		<Scroll className="listview" {...props}>
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
		</Scroll>
	)
}

ListView.propTypes = {
		data: PropTypes.array.isRequired,
}

export default ListView