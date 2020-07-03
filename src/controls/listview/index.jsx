import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import { getData } from '../../common/js/dom'
import Loading from '../loading'


import 'react-lazy-load-image-component/src/effects/blur.css'
import './index.stylus'

class ListView extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			shortCutList: [], 
			currentIndex: 0,
			data: [],
			diff: -1,
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
		this.selectItem = this.selectItem.bind(this)
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
		}, 100);

		this.fixedTitleDiv = this.fixedTitleRef.current
	}

	componentWillUpdate(nextProps, nextState) {
		let newVal = nextState.diff
		let fixedTop = (newVal > 0 && newVal < this.TITLE_HEIGHT) ? newVal - this.TITLE_HEIGHT : 0
		if (this.fixedTop === fixedTop) {
			return
		}
		this.fixedTop = fixedTop
		if (this.fixedTitleDiv) {
			this.fixedTitleDiv.style.transform = `translate3d(0, ${fixedTop}px, 0)`
		}	
	}

	render() {
		return (
			<Scroll className="listview" {...this.props} ref={this.scrollRef} scroll={this.scroll} scrollStart={this.scrollStart} scrollEnd={this.scrollEnd}>
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
												<li className="list-group-item" key={item.id} onClick={() =>this.selectItem(item)}>
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
					<h1 className="fixed-title">{this._getFixedTitle()}</h1>
				</div>
				{
					!this.state.data.length
					&&
					<div className="loading-container">
						<Loading title="正在加载..." />
					</div>
				}
			</Scroll>
		)
	}

	_getFixedTitle() {
		 return this.state.data[this.state.currentIndex] ? this.state.data[this.state.currentIndex].title : ''
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
		if (this.fixedTitleDiv) {
			if (y > 0) {
			 	this.fixedTitleDiv.style.display = "none"
			} else {
				this.fixedTitleDiv.style.display = "block"
			}
		}
		
		for (let i = 0; i < listHeight.length - 1; i++) {
			let h1 = listHeight[i]
			let h2 = listHeight[i + 1]
			if (-y >= h1 && -y < h2) {
				setTimeout(() => {
					this.setState({
						currentIndex: i + 1,
						diff:  h2 + y
					})	
				}, 10);
				
				return
			}
		}
		setTimeout(() => {
			this.setState({
				currentIndex: 0
			})	
		}, 10);
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
	 selectItem(item) {
		this.props.selectItem(item)
	 }
}

ListView.propTypes = {
		data: PropTypes.array.isRequired,
		selectItem: PropTypes.func
}

export default ListView