import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
import { playMode } from '../common/js/config'
import { loadSearch } from '../common/js/cache'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
	combineReducers(reducers),
	{
		singer: {},
		playing: false,
		fullScreen: false,
		playList: [],
		sequenceList: [],
		mode: playMode.sequence,
		currentIndex: -1,
		currentSong: {},
		disc: {},
		topList: {},
		searchHistory: loadSearch()
	},
	composeEnhancers(applyMiddleware(thunk)))