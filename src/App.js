import React from 'react'
import { BrowserRouter as Router } from "react-router-dom"

import Tab from './components/tab'
import MHeader from './components/m-header'
import Player from './controls/player'

function App() {
  return (
		<>
			<Router>
					<MHeader />
					<Tab />
			</Router>
			<Player/>
		</>
  )
}

export default App
