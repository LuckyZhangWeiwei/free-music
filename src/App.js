import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { connect } from 'react-redux'

import Tab from './components/tab'
import MHeader from './components/m-header'
import Player from './controls/player'
import { setCurrentSong } from './store/actions'

function App(props) {
	// useEffect(() => {
	// 	props.dispatch(setCurrentSong(props.playList[props.currentIndex]))
	// }, [props.playList, props.currentIndex])

	useEffect(() => { // has bug when change to different group and the same index, need to be fixed 
		props.dispatch(setCurrentSong(props.playList[props.currentIndex]))
	}, [props.currentIndex])
  
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
