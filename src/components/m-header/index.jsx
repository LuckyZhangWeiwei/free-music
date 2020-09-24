import React, {memo} from 'react'
import { NavLink, Switch, HashRouter } from "react-router-dom"
import { renderRoutes } from "react-router-config"
import UserCenter from './../../components/user-center'

import './index.stylus'
import logo from './timg.jpg'

const MHeader = memo(function () {
  return (
    <div className="m-header">
			<div 
				className="header-icon" 
				style={{
					backgroundImage: `url(${logo})`,
					position: 'absolute',
					left: '20px'
				}}/>
      <h1 className="text">Free Music</h1>
			<HashRouter>
				<NavLink className="mine" to="/user">
					<i className="icon-mine" />
				</NavLink>
					<Switch>
						{ 
						renderRoutes([{
								path: "/user",
								component: UserCenter
							}]) 
						}
					</Switch>
			</HashRouter>
    </div>
  )
})

export default MHeader