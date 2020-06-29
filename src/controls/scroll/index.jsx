import React, {useRef, useEffect, useState} from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'

function Scroll(props) {
	
	let scroll = null
	const wrapperRef = useRef()

	const [scrollData, setScrollData] = useState([])

	const [needFresh, setNeedFresh] = useState(props.needfresh)
	
	useEffect(() => {
		setTimeout(() => {
			_initScroll()	
		}, 20)
	}, [])

	useEffect(() => {
		setScrollData(props.data)

		setTimeout(() => {
			_initScroll()	
	}, 20)

	}, [scrollData])

	useEffect(() => {
		if (needFresh) {
			refresh()
		}
	}, [needFresh])
	
	return (
		<div ref={wrapperRef} {...props}>
			{
				props.children
			}
		</div>
	)

  function	_initScroll() {
		if (!wrapperRef.current) {
			return
		}
		scroll = new BScroll(wrapperRef.current, {
			probeType: props.probeType,
			click: props.click
		})
	}
	function enable() {
	 		scroll &&	scroll.enable()
	}
	function disable() {
		scroll &&	scroll.disable()
	}
	function refresh() {
		scroll &&	scroll.refresh()
	}
}

Scroll.propTypes = {
	probeType: PropTypes.number,
	click: PropTypes.bool,
	data: PropTypes.array,
	needFresh: PropTypes.bool
}

Scroll.defaultProps = {
	probeType: 1,
	click: true,
	data: null
}

export default Scroll