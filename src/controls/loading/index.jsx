import React, {memo} from 'react'
import PropTypes from 'prop-types'

import './index.stylus'
import loading from './loading.gif'

const Loading = memo(function (props) {
	return (
		<div className="loading">
			<img width="24" height="24" src={loading} />
			<p className="desc">{props.title}</p>
		</div>
	)
})

Loading.propTypes = {
		title: PropTypes.string.isRequired,
}

export default Loading