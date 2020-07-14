export const SET_SINGER = 'SET_SINGER'

export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'

export const SET_FULL_SCREEN = 'SET_FULL_SCREEN'

export const SET_PLAYLIST = 'SET_PLAYLIST'

export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'

export const SET_PLAY_MODE = 'SET_PLAY_MODE'

export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'

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

export function fetchSingerData() {
	return (dispatch, getState) => {
		
	}
}