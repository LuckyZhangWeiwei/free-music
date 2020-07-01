import React from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'

// function Scroll(props) {
	
// 	let scroll = null
// 	const wrapperRef = useRef()

// 	const [scrollData, setScrollData] = useState([])

// 	const [needFresh, setNeedFresh] = useState(props.needfresh)
	
// 	useEffect(() => {
// 		setTimeout(() => {
// 			_initScroll()	
// 		}, 20)
// 	}, [])

// 	useEffect(() => {
// 		setScrollData(props.data)

// 		setTimeout(() => {
// 			_initScroll()	
// 	}, 20)

// 	}, [scrollData])

// 	useEffect(() => {
// 		if (needFresh) {
// 			refresh()
// 		}
// 	}, [needFresh])
	
// 	return (
// 		<div ref={wrapperRef} {...props}>
// 			{
// 				props.children
// 			}
// 		</div>
// 	)

//   function	_initScroll() {
// 		if (!wrapperRef.current) {
// 			return
// 		}
// 		scroll = new BScroll(wrapperRef.current, {
// 			probeType: props.probeType,
// 			click: props.click
// 		})
// 	}
// 	function enable() {
// 	 		scroll &&	scroll.enable()
// 	}
// 	function disable() {
// 		scroll &&	scroll.disable()
// 	}
// 	function refresh() {
// 		scroll &&	scroll.refresh()
// 	}
// }

class Scroll extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			scrollData: [],
		}

	 	this.wrapperRef =	React.createRef()
	}

	componentDidMount() {
			setTimeout(() => {
				this._initScroll()	
			}, 20)
	}
	render() {
		return (
				<div ref={this.wrapperRef} {...this.props}>
				{
					this.props.children
				}
		 		</div>
		)
	}
	_initScroll() {
		if (!this.wrapperRef.current) {
			return
		}

		this.scroll = new BScroll(this.wrapperRef.current, {
			probeType: this.props.probeType,
			click: this.props.click
		})

	}
	refresh() {
		this.scroll &&	this.scroll.refresh()
	}
	scrollTo() {
		this.scroll &&	this.scroll.scrollTo.apply(this.scroll, arguments)
	}
	scrollToElement() {
		this.scroll &&	this.scroll.scrollToElement.apply(this.scroll, arguments)
	}
}

Scroll.propTypes = {
	probeType: PropTypes.number,
	click: PropTypes.bool,
	data: PropTypes.array
}

Scroll.defaultProps = {
	probeType: 1,
	click: true,
	data: null
}

export default Scroll