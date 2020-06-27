import React from 'react';
import { NavLink, Switch, Redirect } from "react-router-dom"
import { renderRoutes } from "react-router-config"
import router from './../../router'

import "./index.stylus"

function Tab() {
	return (
		<>
			<div className="tab">
				<NavLink activeClassName="router-link-active" className="tab-item" to="/recommend">
					<span className="tab-link">推荐</span>
				</NavLink>
				<NavLink activeClassName="router-link-active" className="tab-item" to="/singer">
					<span className="tab-link">歌手</span>
				</NavLink>
				<NavLink activeClassName="router-link-active" className="tab-item" to="/rank">
					<span className="tab-link">排行
					</span>
				</NavLink>
				<NavLink activeClassName="router-link-active" className="tab-item" to="/search">
					<span className="tab-link">搜索</span>
				</NavLink>
			</div>
			<div>
				<Switch>
						<Redirect from="/" to="/recommend" exact />
						{ renderRoutes(router) }
					</Switch>
			</div>
		</>
	)
} 

export default Tab