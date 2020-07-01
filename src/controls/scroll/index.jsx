import React from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'

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

		if (this.props.listenScroll) {
			let me = this
			this.scroll.on('scroll', pos => {
				setTimeout(() => {
					me.props.scroll(pos)	
				}, 15);
			})
		}

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
	data: PropTypes.array,
	listenScroll: PropTypes.bool
}

Scroll.defaultProps = {
	probeType: 1,
	click: true,
	data: null,
	listenScroll: false
}

export default Scroll