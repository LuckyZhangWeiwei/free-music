import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
	combineReducers(reducers),
	{
		singer: {}
	},
	composeEnhancers(applyMiddleware(thunk)))