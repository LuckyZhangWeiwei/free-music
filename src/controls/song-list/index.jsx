import React, {useCallback, memo} from 'react'
import PropTypes from 'prop-types'

import './index.stylus'

const SongList = function(props) {
	const songs = props.songs

	const selectItem = useCallback(function(song, index) {
		props.select(song, index)
	}, [songs])

	const getRankCls = (index) => {
		if (index <= 2) {
			return `icon icon${index}`
		} else {
			return 'text'
		}
	}

	const getRankText = (index) => {
		if (index > 2) {
			return index + 1
		}
	}

	return (
		<div className="song-list">
			<ul>
				{
					songs.map((song, index) => {
					  return(
									<li className="item" key={song.id} onClick={() => selectItem(song, index)}>
										{
											props.rank 
											&&
											<div className="rank">
												<span className={getRankCls(index)}>{getRankText(index)}</span>
											</div>
										}
										<div className="content">
											<h2 className="name">{song.name}</h2>
											{
												song.album ?
												<p className="desc">{`${song.singer} . ${song.album}`}</p>
												:
												<p className="desc">{`${song.singer}`}</p>
											}
										</div>
									</li>
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