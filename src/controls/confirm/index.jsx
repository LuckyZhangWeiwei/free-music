import React, { useState, useEffect, memo} from 'react'
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'
import './index.stylus'

const Confirm = memo(props => {
	const [show, setShow] = useState(false)

	useEffect(() => {
		setShow(true)
	}, [])

	const clickCancel = e => {
		e.stopPropagation()
		props.onClickCancel()
	}

	const clickOk = e => {
		e.stopPropagation()
		props.onClickOk()
	}

	return (
		<CSSTransition timeout={300} classNames="confirm-fadein" in={true}>
			<div className="confirm">
					<div className="confirm-wrapper">
						<div className="confirm-content">
						<p className="text">{props.text}</p>
						<div className="operate">
							<div className="operate-btn left" onClick={e => clickCancel(e)}>{props.cancelBtnText}</div>
							<div className="operate-btn" onClick={e => clickOk(e)}>{props.confirmBtnText}</div>
						</div>
					</div>
				</div>
			</div>
		</CSSTransition>
	)
})

Confirm.defaultProps = {
	confirmBtnText: '确定',
	cancelBtnText: '取消'
}

Confirm.propTypes = {
	text: PropTypes.string.isRequired,
	confirmBtnText: PropTypes.string,
	cancelBtnText: PropTypes.string,
	onClickCancel: PropTypes.func.isRequired,
	onClickOk: PropTypes.func.isRequired,
}

export default Confirm
