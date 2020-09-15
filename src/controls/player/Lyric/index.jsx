import React, {memo} from 'react'
import classnames from 'classnames'
import Scroll from './../../scroll'

const PlayerLyric = props => {
	return (
			<Scroll className="middle-r"
				ref={props.lyricListRef} 
				data={props.lyricLines && props.lyricLines}
				>
				<div className="lyric-wrapper" ref={props.lyricLineRef}>
					{
						props.lyricLines.map((item,index) => 
						 <p 
								key={index} 
								className={classnames('text', {'current': props.currentLineNum === index})}>
									{item.txt}
							</p>
						)
					}
				</div>
			</Scroll>
	)
}

export default memo(PlayerLyric, ((preProps, nextProps) => {
	let lyrics = preProps.lyricLines === nextProps.lyricLines
	let currentLine = preProps.currentLineNum === nextProps.currentLineNum
	return lyrics && currentLine
}))
