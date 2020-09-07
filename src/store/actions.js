import { playMode } from '../common/js/config'
import { shuffle } from '../common/js/util'
import { saveSearch, deleteSearch, clearSearch, loadSearch } from '../common/js/cache'

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

export const SET_SEARCHHISTORY = 'SET_SEARCHHISTORY'

export const SET_DEL_HISTORY_ITEM = 'SET_DEL_HISTORY_ITEM'

export const SET_DEL_HISTORY_ALL = 'SET_DEL_HISTORY_ALL'

export const SET_DEL_SONG = 'SET_DEL_SONG'

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
		dispatch(setCurrentSong(list[index]))
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

export function insertSong(song) {
	return (dispatch, getState) => {
		const playList = getState().playList
		const sequenceList = getState().sequenceList
		let currentIndex = getState().currentIndex
		// 记录当前歌曲
		let currentSong = playList[currentIndex]
		// 查找播放列表中是否有待插入歌曲，并返回去索引
		let fpIndex = findIndex(playList, song)
		// 因为插入歌曲，所以索引 +1
		currentIndex++
		// 插入这首歌到当前索引位置
		playList.splice(currentIndex, 0 , song)
		// 如果已经包含了这首歌曲, 则删掉
		if (fpIndex > -1) {
			// 如果当前插入的序号大于列表中的序号
			if (currentIndex > fpIndex) {
				playList.splice(fpIndex, 1)
				currentIndex--
			} else {
				playList.splice(fpIndex + 1, 1)
			}
		}
		dispatch(setPlayList(playList))
		dispatch(setCurrentIndex(currentIndex))

		let currentSIndex = findIndex(sequenceList, currentSong) + 1
		let fsIndex = findIndex(sequenceList, song)
		sequenceList.splice(currentSIndex, 0, song)
		if (fsIndex > -1) {
			if (currentSIndex > fsIndex) {
				sequenceList.splice(fsIndex, 1)
			} else {
				sequenceList.splice(fsIndex + 1, 1)
			}
		}
		dispatch(setSequenceList(sequenceList))
		dispatch(setCurrentSong(playList[currentIndex]))
		dispatch(setFullScreen(true))
		dispatch(setPlayingState(true))
	}
}

function findIndex(list, song) {
	return list.findIndex(item => {
		return item.id === song.id
	})
}

export function setSearchHistory(state) {
	return {
		type: SET_SEARCHHISTORY,
		payload: saveSearch(state)
	}
}

export function delSearchHistoryItem(state) {
	deleteSearch(state)
	return {
		type: SET_DEL_HISTORY_ITEM,
		payload: loadSearch()
	}
}

export function delSearchHistoryAll() {
	clearSearch()
	return {
		type: SET_DEL_HISTORY_ALL,
		payload: null
	}
}

export function delSong(song) {
	return (dispatch, getState) => {
		let playList = getState().playList
		let sequenceList = getState().sequenceList
		let currentIndex = getState().currentIndex

		let pIndex = findIndex(playList, song)
		playList.splice(pIndex, 1)

		let sIndex = findIndex(sequenceList, song)
		sequenceList.splice(sIndex, 1)

		if (currentIndex > pIndex || currentIndex === playList.length - 1) {
			currentIndex--
		}

		if (currentIndex !== currentIndex === playList.length - 1 && currentIndex === pIndex) {
			currentIndex++
		}

		if (!playList.length) {
			dispatch(setPlayingState(false))
		} else {
			dispatch(setPlayingState(true))
		}

		dispatch(setCurrentIndex(currentIndex))
		dispatch(setPlayList(playList))
		dispatch(setSequenceList(sequenceList))
		dispatch(setCurrentSong(playList[currentIndex]))
	}
	
}