import axios from 'axios'

export function getSongById(songIds) {
	const url = `/song/detail?ids=${songIds.join(',')}`
	return axios.get(url).then(res => {
    return Promise.resolve(res)
  })
}