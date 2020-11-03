import axios from 'axios'

export function getSongById(songIds) {
	const url = `http://8.131.69.222:3000/song/detail?ids=${songIds.join(',')}`
	return axios.get(url).then(res => {
    return Promise.resolve(res)
  })
}