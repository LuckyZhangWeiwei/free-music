import React from 'react';
import { BrowserRouter as Router, Switch, Redirect, NavLink } from "react-router-dom"
import router from './router'
import MHeader from './components/m-header'
import { renderRoutes } from "react-router-config"

function App() {
  return (
    <Router>
        <div className="App">
          <MHeader />
          <Switch>
            <Redirect from="/" to="/recommend" exact />
            { renderRoutes(router) }
          </Switch>
        </div>
    </Router>
  );
}

export default App;
