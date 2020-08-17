import React, { useState, useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getTopList } from '../../api/rank'
import { ERR_OK } from '../../api/config'
import Scroll from '../../controls/scroll'
import Loading from '../../controls/loading'

import './index.stylus'

function Rank(props) {
	const [topicList, setTopicList] = useState([])

	useEffect(() => {
		getTopList().then(res => {
			if (res.code === ERR_OK) {
				return res.data.topList
			}
		}).then(data => {
			setTopicList(data)
		})
	}, [])

  return (
    <div className="rank">
			{
				topicList.length ? 
					<Scroll className="toplist" data={topicList}>
						<ul>
							{
								topicList.map((item, index) => {
									return (
												<li className="item" key={item.id}>
													<div className="icon">
														<LazyLoadImage
																src={item.picUrl} 
																alt={item.topTitle}
																height={100}
																width={100} 
																effect="blur" />
													</div>
													<ul className="songlist">
														{
															item.songList.map((song, songIndex) => {
																return (
																		<li className="song" key={song.songname}>
																			<span>{songIndex + 1}</span>
																			<span>{song.songname} - {song.singername}</span>
																		</li>
																)
															})
														}
													</ul>
												</li>
									)
								})
							}
				</ul>
			</Scroll>
			:
			<div className="loading-container">
				<Loading title="正在加载..."/>
			</div>
			}
		</div>
  )
}

export default Rank