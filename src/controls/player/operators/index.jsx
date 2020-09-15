import React, {memo} from 'react'
import PlayMode from '../../../controls/playmode'

const MusicOperator = props => {
	return (
		<>
			<PlayMode />
			<div className={`icon i-left ${props.disableCls}`}>
				<i className="icon-prev" onClick={e => props.prev(e)}></i>
			</div>
			<div className={`icon i-center ${props.disableCls}`}>
				<i className={ props.playIcon } onClick={e => props.togglePlaying(e)}></i>
			</div>
			<div className={`icon i-right ${props.disableCls}`}>
				<i className="icon-next" onClick={e => props.next(e)}></i>
			</div>
			<div className="icon i-right">
				<i className="icon icon-not-favorite"></i>
			</div>
		</>
	)
}

export default memo(MusicOperator)