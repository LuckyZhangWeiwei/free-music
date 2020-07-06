export const SET_SINGER = 'SET_SINGER'

export function setSinger(singer) {
	return {
		type: SET_SINGER,
		payload: singer
	}
}

export function fetchSingerData() {
	return (dispatch, getState) => {
		
	}
}