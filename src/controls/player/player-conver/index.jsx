import React, {memo} from 'react'
import classnames from 'classnames'

const Cover = props => {
	return (
		<>
			<div className="dot-wrapper">
				<span className={classnames('dot', {'active': props.currentShow === 'cd'})}></span>
				<span className={classnames('dot', {'active': props.currentShow === 'lyric'})}></span>
			</div>
			<div className="progress-wrapper">
				<span className="time time-l">{props.formatTime(props.currentTime)}</span>
				<div className="progress-bar-wrapper">
					{props.children}
				</div>
				{
					props.audioRef.current &&
					<span className="time time-r">{props.formatTime(props.audioRef.current.duration)}</span>
				}
			</div>
		</>
	)
}

export default memo(Cover)