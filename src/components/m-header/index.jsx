import React from 'react'
import { NavLink } from "react-router-dom"
import './index.styl'
import logo from './logo@2x.png'

function MHeader() {
  return (
    <div className="m-header">
			<div className="icon" style={{background: `url(${logo})`}}/>
			<div className="icon"/>
      <h1 className="text">Chicken Music</h1>
			<NavLink className="mine" to="/user">
				<i className="icon-mine"></i>
			</NavLink>
    </div>
  )
}

export default MHeader