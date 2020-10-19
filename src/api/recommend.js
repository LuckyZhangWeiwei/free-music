import axios from 'axios'
// import jsonp from '../common/js/jsonp'
// import {commonParams, options} from './config'

export function getRecommend() {
  // const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // const data = Object.assign({}, commonParams, {
  //   platform: 'h5',
  //   uin: 0,
  //   needNewCode: 1
  // })

  // return jsonp(url, data, options)
	const url = 'http://localhost:3000/dj/banner'
	return axios.get(url, {
    params: null
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDiscList() {
	const url = 'http://localhost:3000/top/playlist/highquality?limit=20'
	return axios.get(url, {
    params: null
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDiscDetail(discId) {
	const url = `http://localhost:3000/playlist/detail?id=${discId}`
	return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  })
}