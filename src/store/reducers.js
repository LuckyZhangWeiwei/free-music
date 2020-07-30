import {
	SET_SINGER,
	SET_PLAYING_STATE,
	SET_FULL_SCREEN,
	SET_PLAYLIST,
	SET_SEQUENCE_LIST,
	SET_PLAY_MODE,
	SET_CURRENT_INDEX
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
				let array = new Array()
				let list = {...obj}
				for(let index in list) {
					array.push(list[index])
				}
				return array
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
				let array = new Array()
				let list = {...obj}
				for(let index in list) {
					array.push(list[index])
				}
				return array
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
	}
}