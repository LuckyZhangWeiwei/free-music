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
  <React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
