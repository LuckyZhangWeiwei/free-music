import React, {memo} from 'react'
import { NavLink } from "react-router-dom"

import './index.stylus'
import logo from './timg.jpg'

const MHeader = memo(function () {
  return (
    <div className="m-header">
			<div className="header-icon" 
			style={{
				backgroundImage: `url(${logo})`,
				position: 'absolute',
				left: '20px'
			}}/>
      <h1 className="text">Free Music</h1>
			<NavLink className="mine" to="/user">
				<i className="icon-mine"></i>
			</NavLink>
    </div>
  )
})

export default MHeader