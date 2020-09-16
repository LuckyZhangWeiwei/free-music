const initialPlayerState = {
	showNormalPlayer: true,
	showPlayList: false,
	songReady: false,
	currentTime: null,
	percentage: 0,
	currentShow: 'cd',
	initTouch: false,
	currentPlayingLyric: null,
	currentLineNum: null,
	lyricLines: [],
	lastPreOrNextAction: 'next'
}

const playerReducer = (state, action) => {
	const {type, payload} = action
	switch (type) {
		case 'set_show_normal_player':
			return {...state, showNormalPlayer: payload}
		case 'set_song_ready':
			return {...state, songReady: payload}
		case 'set_currenttime':
			return {...state, currentTime: payload}
		case 'set_percentage':
			return {...state, percentage: payload}
		case 'set_lastPre_or_next_action':
			return {...state, lastPreOrNextAction: payload}
		case 'set_init_touch':
			return {...state, initTouch: payload}
		case 'set_current_show':
			return {...state, currentShow: payload}
		case 'set_show_playlist':
			return {...state, showPlayList: payload}
		case 'set_lyricLines':
			return {...state, lyricLines: payload}
		case 'set_currentPlayingLyric':
			return {...state, currentPlayingLyric: payload}
		case 'set_currentLineNum':
			return {...state, currentLineNum: payload}
	}
}

export {initialPlayerState, playerReducer}