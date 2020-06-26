import React from 'react';
import { BrowserRouter as Router } from "react-router-dom"

import Tab from './components/tab'
import MHeader from './components/m-header'


function App() {
  return (
    <Router>
        <>
					<MHeader />
					<Tab />
        </>
    </Router>
  );
}

export default App;
