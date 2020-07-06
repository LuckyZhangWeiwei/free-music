import React, {useState, useEffect} from 'react'
import { CSSTransition } from 'react-transition-group'
import './index.stylus'

const SingerDetail = function(props) {
	const [show, setShow] = useState(false)
	useEffect(() => {
		setShow(true)
	}, [])

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="singer-detail">singer detail</div>
		</CSSTransition>
	)
}

export default SingerDetail