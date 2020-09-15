import React, {memo} from 'react'
import classnames from 'classnames'
import Scroll from './../../scroll'

const PlayerLyric = props => {
	return (
			<Scroll className="middle-r"
				ref={props.lyricListRef} 
				data={props.lyricRef.current && props.lyricRef.current.lines}
				>
				<div className="lyric-wrapper" ref={props.lyricLineRef}>
					{
						props.lyricRef.current &&
						props.lyricRef.current.lines.map((item,index) => 
						 <p 
								key={index} 
								className={classnames('text', {'current': props.currentLineNumRef.current === index})}>
									{item.txt}
							</p>
						)
					}
				</div>
			</Scroll>
	)
}

// export default memo(PlayerLyric, ((preProps, nextProps) => {
// 	console.log(preProps)
// 	return preProps.lyricRef.current === nextProps.lyricRef.current
// }))

export default PlayerLyric