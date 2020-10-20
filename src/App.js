import React from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { connect } from 'react-redux'

import Tab from './components/tab'
import MHeader from './components/m-header'
import Player from './controls/player'

function App(props) {
	return (
		<>
			<Router>
				<MHeader />
				<Tab />
			</Router>
			{
				props.currentSong.id 
				&&
				<Player />
			}
		</>
  )
}

export default connect(function mapStateToProps(state) {
	return state
}, function mapDispatchToProps(dispatch) {
	return {
		dispatch
	}
})(App)
