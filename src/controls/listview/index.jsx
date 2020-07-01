import React, {useState, useEffect, useRef} from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import { getData } from '../../common/js/dom'


import 'react-lazy-load-image-component/src/effects/blur.css'
import './index.stylus'

// const ListView = function (props) {
// 	const { data } = props

// 	const ANCHOR_HEIGHT = 18

// 	const scrollRef = useRef()
// 	const listGroupRef = useRef()

// 	const touch = {}
// 	let listHeight = []

// 	const [shortCutList, setShortCutList] = useState([])
// 	const [scrollY, setScrollY] = useState(-1)
// 	const [currentIndex, setCurrentIndex] = useState(0)

// 	useEffect(() => {
// 		const list = data.map(group => {
// 			return group.title.substr(0, 1)
// 		})
// 		setShortCutList(list)

// 		setTimeout(() => {
// 			_calculateHeight()
// 		}, 20);
// 	}, [data])

// 	return (
// 		<Scroll className="listview" ref={scrollRef} listenScroll={true} scroll={scroll}>
// 			<ul ref={listGroupRef}>
// 			{
// 				data.map((group, index) => {
// 					return (
// 						<li className="list-group" key={group.title}>
// 							<h2 className="list-group-title">{group.title}</h2>
// 							<ul>
// 								{
// 									group.items.map((item, index) => {
// 										return (
// 											<li className="list-group-item" key={item.name}>
// 												<LazyLoadImage className="avatar" src={item.avatar} alt={item.name} effect="blur" />
// 												<span className="name">{item.name}</span>
// 											</li>
// 										)
// 									})
// 								}
// 							</ul>
// 						</li>
// 						)
// 					})
// 				}
// 			</ul>
// 			<div className="list-shortcut" onTouchStart={onShortcutTouchStart} onTouchMove={onShortcutTouchMove}>
// 				<ul>
// 					{
// 						shortCutList.map((item, index) => {
// 							return (
// 								<li className="item" key={item} data-index={index}>{item}</li>
// 							)
// 						})
// 					}
// 				</ul>
// 			</div>
// 		</Scroll>
// 	)

// 	function onShortcutTouchStart(e) {
// 		let anchorIndex = getData(e.target, 'index')
// 		let firstTouch = e.touches[0]
// 		touch.y1 = firstTouch.pageY
// 		touch.anchorIndex = anchorIndex
// 		_scrollTo(anchorIndex)
// 	}

// 	function onShortcutTouchMove(e) {
// 		e.stopPropagation()
// 		let nextTouch = e.touches[0]
// 		touch.y2 = nextTouch.pageY
// 		let delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
// 		let anchorIndex = parseInt(touch.anchorIndex) + delta
// 		_scrollTo(anchorIndex)
// 	}

// 	function _scrollTo(index) {
// 		const group =	listGroupRef.current.children
// 		const touchedGroup = Array.from(group)[index]
// 		scrollRef.current.scrollToElement(touchedGroup, 0)
// 	}

// 	function scroll(pos) {
// 		setScrollY(pos.y)
// 	}

// 	function _calculateHeight() {
// 		listHeight = []
// 	}
 
// }

class ListView extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			shortCutList: [], 
			currentIndex: 0,
			data: [],
		}

		this.touch = {}
		this.listHeight = []
		this.ANCHOR_HEIGHT = 18
		this.TITLE_HEIGHT = 30
		this.checkState = false

		this.listGroupRef = React.createRef()
		this.scrollRef = React.createRef()
		this.fixedTitleRef = React.createRef()

		this.onShortcutTouchMove = this.onShortcutTouchMove.bind(this)
		this.onShortcutTouchStart = this.onShortcutTouchStart.bind(this)
		this.scroll = this.scroll.bind(this)
	}
	componentWillReceiveProps(props) {
		this.setState({
			data: props.data
		})
		const list = props.data.map(group => {
			return group.title.substr(0, 1)
		})
		this.setState({
			shortCutList: list
		})
	}
	componentDidMount() {
		setTimeout(() => {
			this._calculateHeight()
		}, 200);
	}
	render() {
		
		return (
		<Scroll className="listview" {...this.props} ref={this.scrollRef} listenScroll={true} scroll={this.scroll}>
			<ul ref={this.listGroupRef}>
			{
				this.props.data.map((group, index) => {
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
			<div className="list-shortcut" onTouchStart={this.onShortcutTouchStart} onTouchMove={this.onShortcutTouchMove}>
				<ul>
					{
						this.state.shortCutList.map((item, index) => {
							return (
								<li className={classnames('item', {'current': this.state.currentIndex === index})} key={item} data-index={index}>{item}</li>
							)
						})
					}
				</ul>
			</div>
			<div className="list-fixed" ref={this.fixedTitleRef}>
				<h1 className="fixed-title">
					{
						this.state.data[this.state.currentIndex] ? this.state.data[this.state.currentIndex].title : ''
					}
				</h1>
			</div>
		</Scroll>
		)
	}

	onShortcutTouchStart(e) {
 		let anchorIndex = getData(e.target, 'index')
 		let firstTouch = e.touches[0]
 		this.touch.y1 = firstTouch.pageY
 		this.touch.anchorIndex = anchorIndex
 		this._scrollTo(anchorIndex)
 	}

 	onShortcutTouchMove(e) {
 		e.stopPropagation()
 		let nextTouch = e.touches[0]
 		this.touch.y2 = nextTouch.pageY
 		let delta = (this.touch.y2 - this.touch.y1) / this.ANCHOR_HEIGHT | 0
 		let anchorIndex = parseInt(this.touch.anchorIndex) + delta
 		this._scrollTo(anchorIndex)
 	}

 	_scrollTo(index) {
		if (!index && index !==0) {
			return
		}
		if (index < 0) {
			index = 0
		} else if (index > this.listHeight.length -1) {
			index = this.listHeight.length -1
		}
 		const group =	this.listGroupRef.current.children
 		const touchedGroup = Array.from(group)[index]
 		this.scrollRef.current.scrollToElement(touchedGroup, 0)
 	}

 	scroll(pos) {
		const listHeight = this.listHeight
		const { y } = pos
		const fixedTitleDiv = this.fixedTitleRef.current
		if (y > 0) {
			fixedTitleDiv.style.display = "none"
		} else {
			fixedTitleDiv.style.display = "block"
		}
		for (let i = 0; i < listHeight.length - 1; i++) {
			let h1 = listHeight[i]
			let h2 = listHeight[i+1]
			if (-y >= h1 && -y < h2) {
				this.setState({
					currentIndex: i + 1
				})
				return
			}
		}
		this.setState({
			currentIndex: 0
		})
 	}

 	_calculateHeight() {
 		  this.listHeight = []
			const liList = this.listGroupRef.current.children
		  const list = Array.from(liList)
		  let height = 0
			if (list.length > 0) {
				for (let i = 0; i < list.length; i++) {
					let item = list[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
			}
 	}
}


ListView.propTypes = {
		data: PropTypes.array.isRequired,
}

export default ListView