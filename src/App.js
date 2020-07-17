import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router } from "react-router-dom"
import { connect } from 'react-redux'

import Tab from './components/tab'
import MHeader from './components/m-header'
import Player from './controls/player'

function App(props) {
	const [currentSong, setCurrentSong] = useState()
 
	useEffect(() => {
		setCurrentSong(props.playList[props.currentIndex])
	}, [props.playList, props.currentIndex])
  
	return (
		<>
			<Router>
				<MHeader />
				<Tab />
			</Router>
			{
				currentSong 
				&&
				<Player currentSong={currentSong} />
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
