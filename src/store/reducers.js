import {
	SET_SINGER,
	SET_PLAYING_STATE,
	SET_FULL_SCREEN,
	SET_PLAYLIST,
	SET_SEQUENCE_LIST,
	SET_PLAY_MODE,
	SET_CURRENT_INDEX,
	SET_CURRENT_SONG,
	SET_DISC,
	SET_TOPLIST,
	SET_CURRENT_TAB
} from './actions'

import { playMode } from '../common/js/config'

export default {
	singer(state=null, action) {
		const { type, payload } = action
		switch (type) {
			case SET_SINGER:
				return payload
			default:
		}
		return state
	},
	playingState(state = false, action) {
		const { type, payload } = action
		switch (type) {
			case SET_PLAYING_STATE:
				return payload
			default:
		}
		return state
	},
	isFullScreen(state = false, action) {
		const { type, payload } = action
		switch (type) {
			case SET_FULL_SCREEN:
				return payload
			default:
		}
		return state
	},
	playList(state = [], action) {
		const { type, payload } = action
		switch (type) {
			case SET_PLAYLIST:
				let obj = {}
				Object.assign(obj, payload)
				return Object.values(obj)
			default:
		}
		return state
	},
	sequenceList(state = [], action) {
		const { type, payload } = action
		switch (type) {
			case SET_SEQUENCE_LIST:
				let obj = {}
				Object.assign(obj, payload)
				return Object.values(obj)
			default:
		}
		return state
	},
	playMode(state = playMode.sequence, action) {
		const { type, payload } = action
		switch (type) {
			case SET_PLAY_MODE:
				return payload
			default:
		}
		return state
	},
	currentIndex(state = -1, action) {
		const { type, payload } = action
		switch (type) {
			case SET_CURRENT_INDEX:
				return payload
			default:
		}
		return state
	},
	currentSong(state = {}, action) {
		const { type, payload } = action
		switch (type) {
			case SET_CURRENT_SONG:
				let obj = {}
				Object.assign(obj, payload)
				return obj
			default:
		}
		return state
	},
	disc(state={}, action) {
		const { type, payload } = action
		switch (type) {
			case SET_DISC:
				let obj = {}
				Object.assign(obj, payload)
				return obj
			default:
		}
		return state
	},
	topList(state={}, action) {
		const { type, payload } = action
		switch (type) {
			case SET_TOPLIST:
				let obj = {}
				Object.assign(obj, payload)
				return obj
			default:
		}
		return state
	},
	currentSelectedTab(state=0, action) {
		const { type, payload } = action
		switch (type) {
			case SET_CURRENT_TAB:
				return payload
		}
		return state 
	}
}