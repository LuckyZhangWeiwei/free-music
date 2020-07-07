import React from 'react'

import './index.stylus'

const SongList = function(props) {
	const songs = props.songs

	return (
		<div className="song-list">
			<ul>
				{
					songs.map((song, index) => {
					  return(
						<li className="item" key={song.id}>
							<div className="content">
								<h2 className="name">{song.name}</h2>
								<p className="desc">{`${song.singer} . ${song.album}`}</p>
							</div>
						</li>
						)
					})
				}
			</ul>
		</div>
	)
}

export default SongList