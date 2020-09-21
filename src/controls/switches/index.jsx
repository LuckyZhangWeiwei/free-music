import React, {useCallback, memo} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './index.stylus'

const Switches = props => {
	const switches = props.switches
	const currentIndex = props.currentIndex

	const switchItem = useCallback((e, index) => {
			e.stopPropagation()
			props.onSwitchItem(index)
	}, [props.currentIndex])

	return (
		<ul className="switches">
			{
				switches.map((item, index) => (
					<li
						key={item.name}
						className={classnames('switch-item', {'active': currentIndex === index})}
						onClick={e => switchItem(e, index)}>
						<span>{item.name}</span>
					</li>
				))
			}
		</ul>
	)
}

Switches.defaultProps = {
	currentIndex: 0,
	switches: []
}

Switches.propTypes = {
	switches: PropTypes.array.isRequired,
	currentIndex: PropTypes.number
}

export default memo(Switches)