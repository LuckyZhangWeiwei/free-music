import { playMode } from "../common/js/config"
import { shuffle } from "../common/js/util"

export const SET_SINGER = 'SET_SINGER'

export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'

export const SET_FULL_SCREEN = 'SET_FULL_SCREEN'

export const SET_PLAYLIST = 'SET_PLAYLIST'

export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'

export const SET_PLAY_MODE = 'SET_PLAY_MODE'

export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'

export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'

export const SET_DISC = 'SET_DISC'

export const SET_TOPLIST = 'SET_TOPLIST'

export const SET_CURRENT_TAB = 'SET_CURRENT_TAB'

export function setSinger(singer) {
	return {
		type: SET_SINGER,
		payload: singer
	}
}

export function setPlayingState(state) {
	return {
		type: SET_PLAYING_STATE,
		payload: state
	}
}

export function setFullScreen(state) {
	return {
		type: SET_FULL_SCREEN,
		payload: state
	}
}

export function setPlayList(state) {
	return {
		type: SET_PLAYLIST,
		payload: state
	}
}

export function setSequenceList(state) {
	return {
		type: SET_SEQUENCE_LIST,
		payload: state
	}
}

export function setPlayMode(state) {
	return {
		type: SET_PLAY_MODE,
		payload: state
	}
}

export function setCurrentIndex(state) {
	return {
		type: SET_CURRENT_INDEX,
		payload: state
	}
}

export function loadPlayList(list) {
	return (dispatch, getState) => {
		if (playMode.random === getState().playMode) {
			let randomList = shuffle(list)
			dispatch(setPlayList(randomList))
		} else {
			dispatch(setPlayList(list))
		}
		dispatch(setSequenceList(list))
	}
}

export function selectPlay(list, index) {
	return (dispatch, getState) => {
		if(playMode.random === getState().playMode) {
			const song = getState().sequenceList[index]
			const changedIndex = getState().playList.findIndex(item => {
				return item.id === song.id
			})
			dispatch(setCurrentIndex(changedIndex))	
		} else {
			dispatch(setCurrentIndex(index))
		}
		// dispatch(setCurrentSong(getState().playList[index]))
		dispatch(setFullScreen(true))
		dispatch(setPlayingState(true))
	}
}

export function setCurrentSong(state) {
	return {
		type: SET_CURRENT_SONG,
		payload: state
	}
}

export function random(list) {
	return (dispatch, getState) => {
		dispatch(setPlayMode(playMode.random))
		dispatch(setSequenceList(list))
		let randomList = shuffle(list)
		dispatch(setPlayList(randomList))
		dispatch(setCurrentIndex(0))
		dispatch(setFullScreen(true))
		dispatch(setPlayingState(true))
	}
}

export function setDisc(state) {
	return {
		type: SET_DISC,
		payload: state
	}
}

export function setTopList(state) {
	return {
		type: SET_TOPLIST,
		payload: state
	}
}

export function setCurrentTab(state) {
	return {
		type: SET_CURRENT_TAB,
		payload: state
	}
}