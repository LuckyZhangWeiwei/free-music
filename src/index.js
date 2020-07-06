import React from 'react'
import ReactDOM from 'react-dom'
import './common/stylus/index.styl'
import initReactFastclick from 'react-fastclick'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
// import * as serviceWorker from './serviceWorker'

initReactFastclick();

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
  document.getElementById('root')
)
