import React, {useState, useEffect, memo, useRef, useCallback}  from 'react'
import { CSSTransition } from 'react-transition-group'
import RandomPlay from '../../controls/random-play'
import './index.stylus'

import Switches from '../../controls/switches'

function UserCenter(props) {
	const [show, setShow] = useState(false)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [switcheNames, setSwitchNames] = useState([{name: '我喜欢的'},{name: '最近听得'}])

	
	const playBtnRef = useRef(null)
	const listWrapperRef = useRef(null)

	useEffect(() => {
		setShow(true)
	}, [])

	const switchItem = useCallback(index => {
		setCurrentIndex(index)
	}, [])

  return (
    <CSSTransition timeout={300} classNames="slide" in={show}>
			<div className="user-center">
				<div className="back" onClick={() => props.history.goBack()}>
					<i className="icon-back"></i>
				</div>
				<div className="switches-wrapper">
					<Switches 
						switches={switcheNames} 
						currentIndex={currentIndex} 
						onSwitchItem={index => switchItem(index)} />
				</div>
				<RandomPlay text="随机播放全部" playWrapperRef={playBtnRef}/>
				<div className="list-wrapper" ref={listWrapperRef}></div>
			</div>
		</CSSTransition>
  )
}

export default memo(UserCenter)