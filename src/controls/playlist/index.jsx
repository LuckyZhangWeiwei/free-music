import React, {memo, useEffect, useState, useRef, useCallback} from 'react'
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'

import './index.stylus'

const PlayList = props => {
	
	const [show, setShow] = useState(false)

	useEffect(() => {
		setShow(true)
	}, [])

	const hidePlaylist = useCallback(e => {
		e.stopPropagation()
		props.hidePlayList()
	}, [])
	return (
		<CSSTransition timeout={300} classNames="list-fade" in={show}>
			<div className="playlist" onClick={e => hidePlaylist(e)}>
				<div className="list-wrapper" onClick={e => {e.stopPropagation()}}>
					<div className="list-header">
						<h1 className="title">
							<i className="icon">
								<span className="text"></span>
								<span className="clear"><i className="icon-clear"></i></span>
							</i>
						</h1>
					</div>
					<div className="list-content">
						<ul>
							<li className="item">
								<i className="current"></i>
								<span className="text"></span>
								<span className="like">
									<i className="icon-not-favorite"></i>
								</span>
								<span className="delete">
									<i className="icon-delete"></i>
								</span>
							</li>
						</ul>
					</div>
					<div className="list-operate">
						<div className="add">
							<i className="icon-add"></i>
							<span className="text">添加歌曲到队列</span>
						</div>
					</div>
					<div className="list-close" onClick={e => hidePlaylist(e)}>
						<span>关闭</span>
					</div>
				</div>
			</div>
		</CSSTransition>
	)
}

export default memo(PlayList)