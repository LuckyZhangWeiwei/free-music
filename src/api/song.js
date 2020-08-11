import axios from 'axios'

export function getSongById(songIds) {
	const url = `http://localhost:3000/song/detail?ids=${songIds.join(',')}`
	return axios.get(url).then(res => {
    return Promise.resolve(res)
  })
}