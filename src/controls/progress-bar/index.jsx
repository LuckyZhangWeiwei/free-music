import React, {memo, useEffect, useRef} from 'react'
import { prefixStyle } from '../../common/js/dom'

import './index.stylus'

const ProgressBar = props => {
	const progressBarRef = useRef()
	const progressRef = useRef()
	const progressBtnRef = useRef()

	const transform = prefixStyle('transform')

	useEffect(() => {
		const barWidth = progressBarRef.current.clientWidth - 16	// 减去按钮的宽度
		const offsetWidth = props.percent * barWidth
		progressRef.current.style.width = `${offsetWidth}px`
		progressBtnRef.current.style[transform] = `translate3d(${offsetWidth}px, 0 , 0)`
	}, [props.percent])

	return (
		<div className="progress-bar" ref={progressBarRef}>
			<div className="bar-inner">
				<div className="progress" ref={progressRef}></div>
				<div className="progress-btn-wrapper" ref={progressBtnRef}>
					<div className="progress-btn"></div>
				</div>
			</div>
		</div>
	)
}

export default memo(ProgressBar)

