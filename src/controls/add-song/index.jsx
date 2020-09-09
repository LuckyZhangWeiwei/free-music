import React, { useState, useEffect, memo, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import './index.stylus'

const AddSong = props => {
	const [show, setShow] = useState(false)

	useEffect(() => {
		setShow(true)
	}, [])

	const close = useCallback(e => {
		e.stopPropagation()
		props.closeAddSong()
	}, [])

	return (
		<CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="add-song">
				<div className="header">
					<h1 className="title">添加歌曲到列表</h1>
					<div className="close" onClick={e => close(e)}>
						<i className="icon-close"></i>
					</div>
				</div>
				<div className="search-box-wrapper"></div>
				<div className="shortcut"></div>
				<div className="search-result"></div>
			</div>
		</CSSTransition>
	)
}

export default memo(AddSong)