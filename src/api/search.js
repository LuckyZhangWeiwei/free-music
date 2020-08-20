import axios from 'axios'

export function getHotSearchTag() {
	const url = 'http://localhost:3000/search/hot/'
	return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}