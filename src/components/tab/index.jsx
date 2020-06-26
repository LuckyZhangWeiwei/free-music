import React from 'react';
import { BrowserRouter as Router, NavLink, Switch, Redirect } from "react-router-dom"
import "./index.stylus"
import router from './../../router'
import { renderRoutes } from "react-router-config"

function Tab() {
	return (
		<Router>
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
		</Router>
	)
} 

export default Tab