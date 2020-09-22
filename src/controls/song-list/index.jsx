import React, {useCallback, memo} from 'react'
import PropTypes from 'prop-types'

import './index.stylus'

const getRankCls = index => {
	if (index <= 2) {
		return `icon icon${index}`
	} else {
		return 'text'
	}
}

const getRankText = index => {
	if (index > 2) {
		return index + 1
	}
}

const SongListItem = memo(props => {

	const selectItem = useCallback((song, index) => {
		props.select(song, index)
	}, [])

	return (
			<li className="item" onClick={() => selectItem(props.song, props.index)}>
				{
					props.rank 
					&&
					<div className="rank">
						<span className={getRankCls(props.index)}>{getRankText(props.index)}</span>
					</div>
				}
				<div className="content">
					<h2 className="name">{props.song.name}</h2>
					{
						props.song.album ?
						<p className="desc">{`${props.song.singer} . ${props.song.album}`}</p>
						:
						<p className="desc">{`${props.song.singer}`}</p>
					}
				</div>
			</li>
	)
})

const SongList = props => {
	const songs = props.songs

	return (
		<div className="song-list">
			<ul>
				{
					songs.map((song, index) => {
					  return(
									<SongListItem 
										key={index}
										rank={props.rank}
										song={song}
										index={index}
										select={(song, index) => props.select(song, index)}
									/>
								)
					})
				}
			</ul>
		</div>
	)
}

SongList.defaultProps = {
	rank: false
}

SongList.propTypes = {
	songs: PropTypes.array.isRequired,
	rank: PropTypes.bool
}



export default memo(SongList)