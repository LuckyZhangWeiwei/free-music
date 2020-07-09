import React, {useState, useEffect, useRef, useMemo, useCallback, memo} from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Scroll from '../scroll'
import { getData } from '../../common/js/dom'
import Loading from '../loading'


import 'react-lazy-load-image-component/src/effects/blur.css'
import './index.stylus'

const ListView = function(props) {
	const ANCHOR_HEIGHT = 18
	const TITLE_HEIGHT = 30

	const listGroupRef = useRef()
	const scrollRef = useRef()
	const fixedTitleRef = useRef()
	const touchRef = useRef()

	const [shortCutList, setShortCutList] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [data, setData] = useState([])
	const [listHeight, setListHeight] = useState([])

	useEffect(() => {
		setData(props.data)
		const list = props.data.map(group => {
			return group.title.substr(0, 1)
		})

		setShortCutList(list)
		_calculateHeight()
		
	}, [props.data])

	useEffect(() => {
		touchRef.current = {}
		return () => {
			scrollRef.current.destroy()
		}
	}, [])

	const _getFixedTitle= useMemo(() => {
		return data[currentIndex] ? data[currentIndex].title : ''
	}, [currentIndex, data])

	return (
		<Scroll className="listview" {...props} ref={scrollRef} scroll={scroll}>
			<ul ref={listGroupRef}>
			{
				props.data.map((group, index) => {
					return (
						<li className="list-group" key={group.title}>
							<h2 className="list-group-title">{group.title}</h2>
							<ul>
								{
									group.items.map((item, index) => {
										return (
											<li className="list-group-item" key={item.id} onClick={() => selectItem(item)}>
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
								<li className={classnames('item', {'current': currentIndex === index})} key={item} data-index={index}>{item}</li>
							)
						})
					}
				</ul>
			</div>
			<div className="list-fixed" ref={fixedTitleRef}>
				<h1 className="fixed-title">{_getFixedTitle}</h1>
			</div>
			{
				!data.length
				&&
				<div className="loading-container">
					<Loading title="正在加载..." />
				</div>
			}
		</Scroll>
	)

 function onShortcutTouchStart(e) {
 		let anchorIndex = getData(e.target, 'index')
 		let firstTouch = e.touches[0]
 		touchRef.current.y1 = firstTouch.pageY
 		touchRef.current.anchorIndex = anchorIndex
 		_scrollTo(anchorIndex)
 	}

 function	onShortcutTouchMove(e) {
 		e.stopPropagation()
 		let nextTouch = e.touches[0]
 		touchRef.current.y2 = nextTouch.pageY
 		let delta = (touchRef.current.y2 - touchRef.current.y1) / ANCHOR_HEIGHT | 0
 		let anchorIndex = parseInt(touchRef.current.anchorIndex) + delta
 		_scrollTo(anchorIndex)
 	}

  function _scrollTo(index) {
		if (!index && index !==0) {
			return
		}
		if (index < 0) {
			index = 0
		} else if (index > listHeight.length -1) {
			index = listHeight.length -1
		}
 		const group =	listGroupRef.current.children
 		const touchedGroup = Array.from(group)[index]
 		scrollRef.current.scrollToElement(touchedGroup, 0)
 	}

 function	scroll(pos) {
		const { y } = pos
		if (fixedTitleRef.current) {
			if (y > 0) {
			 	fixedTitleRef.current.style.display = "none"
			} else {
				fixedTitleRef.current.style.display = "block"
			}
		}

		for (let i = 0; i < listHeight.length - 1; i++) {
			let h1 = listHeight[i]
			let h2 = listHeight[i + 1]
			if (-y >= h1 && -y < h2) {
				setCurrentIndex(i + 1)
				/************handle fixed title transition****************/
					if(h2 - TITLE_HEIGHT <= -y) {
						fixedTitleRef.current.style.transform = `translate3d(0, ${-(TITLE_HEIGHT-(h2 + y))}px, 0)`
					} else {
						fixedTitleRef.current.style.transform = `translate3d(0, 0, 0)`
					}
				/****************************/
				return
			}
		}
		setCurrentIndex(0)
		/***********handle fixed title transition***************/
		if(listHeight[0] - TITLE_HEIGHT <= -y) {
			fixedTitleRef.current.style.transform = `translate3d(0, ${-(TITLE_HEIGHT-(listHeight[0] + y))}px, 0)`
		}
		/**************************/
 	}

  function _calculateHeight() {
		let tempListHeight = []
		const list = Array.from(listGroupRef.current.children)
		let height = 0
		if (list.length > 0) {
			for (let i = 0; i < list.length; i++) {
				let item = list[i]
				height += item.clientHeight
				tempListHeight.push(height)
			}
		}
		setListHeight(tempListHeight)
 	}

	function selectItem(item) {
		props.selectItem(item)
	}
}

ListView.propTypes = {
	data: PropTypes.array.isRequired,
	selectItem: PropTypes.func
}

export default memo(ListView)

/*******************************/
// import React from 'react'
// import { LazyLoadImage } from 'react-lazy-load-image-component'
// import classnames from 'classnames'
// import PropTypes from 'prop-types'
// import Scroll from '../scroll'
// import { getData } from '../../common/js/dom'
// import Loading from '../loading'


// import 'react-lazy-load-image-component/src/effects/blur.css'
// import './index.stylus'

// class ListView extends React.Component {
// 	_isMounted = false
// 	constructor(props) {
// 		super(props)
// 		this.state = {
// 			shortCutList: [], 
// 			currentIndex: 0,
// 			data: [],
// 			diff: -1
// 		}

// 		this.touch = {}
// 		this.listHeight = []
// 		this.ANCHOR_HEIGHT = 18
// 		this.TITLE_HEIGHT = 30
// 		this.checkState = false

// 		this.listGroupRef = React.createRef()
// 		this.scrollRef = React.createRef()
		
// 		this.fixedTitleRef = React.createRef()

// 		this.onShortcutTouchMove = this.onShortcutTouchMove.bind(this)
// 		this.onShortcutTouchStart = this.onShortcutTouchStart.bind(this)
// 		this.scroll = this.scroll.bind(this)
// 		this.selectItem = this.selectItem.bind(this)
// 	}
// 	UNSAFE_componentWillReceiveProps(props) {
// 		this.setState({
// 			data: props.data
// 		})
// 		const list = props.data.map(group => {
// 			return group.title.substr(0, 1)
// 		})
// 		this.setState({
// 			shortCutList: list
// 		})
// 	}

// 	// static getDerivedStateFromProps(props, state) {
// 	// 	if (props.data !== state.data) {
// 	// 		return {
// 	// 			data: props.data,
// 	// 			shortCutList:  props.data.map(group => {
// 	// 				return group.title.substr(0, 1)
// 	// 			})
// 	// 		}
// 	// 	}
// 	// }

// 	componentDidMount() {
// 		setTimeout(() => {
// 			this._calculateHeight()
// 		}, 100);

// 		this.fixedTitleDiv = this.fixedTitleRef.current
// 		this._isMounted = true
	
// 	}

// 	UNSAFE_componentWillUpdate(nextProps, nextState) {
// 		let newVal = nextState.diff
// 		let fixedTop = (newVal > 0 && newVal < this.TITLE_HEIGHT) ? newVal - this.TITLE_HEIGHT : 0
// 		if (this.fixedTop === fixedTop) {
// 			return
// 		}
// 		this.fixedTop = fixedTop
// 		if (this.fixedTitleDiv) {
// 			this.fixedTitleDiv.style.transform = `translate3d(0, ${fixedTop}px, 0)`
// 		}	
// 	}

// 	componentWillUnmount() {
// 		this._isMounted = false
// 	}

// 	render() {
// 		return (
// 			<Scroll className="listview" {...this.props} ref={this.scrollRef} scroll={this.scroll} scrollStart={this.scrollStart} scrollEnd={this.scrollEnd}>
// 				<ul ref={this.listGroupRef}>
// 				{
// 					this.props.data.map((group, index) => {
// 						return (
// 							<li className="list-group" key={group.title}>
// 								<h2 className="list-group-title">{group.title}</h2>
// 								<ul>
// 									{
// 										group.items.map((item, index) => {
// 											return (
// 												<li className="list-group-item" key={item.id} onClick={() =>this.selectItem(item)}>
// 													<LazyLoadImage className="avatar" src={item.avatar} alt={item.name} effect="blur" />
// 													<span className="name">{item.name}</span>
// 												</li>
// 											)
// 										})
// 									}
// 								</ul>
// 							</li>
// 							)
// 						})
// 					}
// 				</ul>
// 				<div className="list-shortcut" onTouchStart={this.onShortcutTouchStart} onTouchMove={this.onShortcutTouchMove}>
// 					<ul>
// 						{
// 							this.state.shortCutList.map((item, index) => {
// 								return (
// 									<li className={classnames('item', {'current': this.state.currentIndex === index})} key={item} data-index={index}>{item}</li>
// 								)
// 							})
// 						}
// 					</ul>
// 				</div>
// 				<div className="list-fixed" ref={this.fixedTitleRef}>
// 					<h1 className="fixed-title">{this._getFixedTitle()}</h1>
// 				</div>
// 				{
// 					!this.state.data.length
// 					&&
// 					<div className="loading-container">
// 						<Loading title="正在加载..." />
// 					</div>
// 				}
// 			</Scroll>
// 		)
// 	}

// 	_getFixedTitle() {
// 		 return this.state.data[this.state.currentIndex] ? this.state.data[this.state.currentIndex].title : ''
// 	}
// 	onShortcutTouchStart(e) {
//  		let anchorIndex = getData(e.target, 'index')
//  		let firstTouch = e.touches[0]
//  		this.touch.y1 = firstTouch.pageY
//  		this.touch.anchorIndex = anchorIndex
//  		this._scrollTo(anchorIndex)
//  	}

//  	onShortcutTouchMove(e) {
//  		e.stopPropagation()
//  		let nextTouch = e.touches[0]
//  		this.touch.y2 = nextTouch.pageY
//  		let delta = (this.touch.y2 - this.touch.y1) / this.ANCHOR_HEIGHT | 0
//  		let anchorIndex = parseInt(this.touch.anchorIndex) + delta
//  		this._scrollTo(anchorIndex)
//  	}

//  	_scrollTo(index) {
// 		if (!index && index !==0) {
// 			return
// 		}
// 		if (index < 0) {
// 			index = 0
// 		} else if (index > this.listHeight.length -1) {
// 			index = this.listHeight.length -1
// 		}
//  		const group =	this.listGroupRef.current.children
//  		const touchedGroup = Array.from(group)[index]
//  		this.scrollRef.current.scrollToElement(touchedGroup, 0)
//  	}

//  	scroll(pos) {
// 		 if (!this._isMounted) {
// 			 return
// 		 }
// 		const listHeight = this.listHeight
// 		const { y } = pos
// 		if (this.fixedTitleDiv) {
// 			if (y > 0) {
// 			 	this.fixedTitleDiv.style.display = "none"
// 			} else {
// 				this.fixedTitleDiv.style.display = "block"
// 			}
// 		}
		
// 		for (let i = 0; i < listHeight.length - 1; i++) {
// 			let h1 = listHeight[i]
// 			let h2 = listHeight[i + 1]
// 			if (-y >= h1 && -y < h2) {
// 				setTimeout(() => {
// 					this.setState({
// 						currentIndex: i + 1,
// 						diff:  h2 + y
// 					})	
// 				}, 20)
// 				return
// 			}
// 		}
// 		setTimeout(() => {
// 			this.setState({
// 				currentIndex: 0
// 			})	
// 		}, 20)
//  	}

//  	_calculateHeight() {
//  		  this.listHeight = []
// 			const liList = this.listGroupRef.current === null ? [] : this.listGroupRef.current.children
// 		  const list = Array.from(liList)
// 		  let height = 0
// 			if (list.length > 0) {
// 				for (let i = 0; i < list.length; i++) {
// 					let item = list[i]
// 					height += item.clientHeight
// 					this.listHeight.push(height)
// 				}
// 			}
//  	}
// 	 selectItem(item) {
// 		this.props.selectItem(item)
// 	 }
// }

// ListView.propTypes = {
// 		data: PropTypes.array.isRequired,
// 		selectItem: PropTypes.func
// }

// export default ListView
/*******************************/