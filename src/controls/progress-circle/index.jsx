import React, {memo, useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import './index.stylus'

const ProgressCircle = props => {
	const [dashOffset, setDashOffset] = useState(0)

	useEffect(() => {
		let offset = (1 - props.percentage) * Math.PI * 100
		setDashOffset(offset)
	}, [props.percentage])
	return (
		<div className="progress-circle">
			<svg width={props.radius} height={props.radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
				<circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" strokeDasharray={Math.PI * 100} strokeDashoffset={dashOffset}></circle>
			</svg>
			{
				props.children
			}
		</div>
	)
}

ProgressCircle.propTypes = {
	radius: PropTypes.number.isRequired,
	percentage: PropTypes.number.isRequired,
}

export default memo(ProgressCircle)