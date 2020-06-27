import React, { useEffect } from 'react'
import { getRecommend } from '../../api/recommend'
import { ERR_OK } from '../../api/config'

function Recommend() {
	useEffect(() => {
		getRecommend()
			.then(res => {
				if (res.code === ERR_OK) {
					console.log(res.data)
				}
			})
	})
  return (
    <div>Recommend</div>
  )
}

export default Recommend