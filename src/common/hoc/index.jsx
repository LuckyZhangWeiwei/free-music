import React from 'react'

function WithHandleBottom (WrappedComponet) {
	return function HandleBottomComponent(props) {
		return (
				<>
					<WrappedComponet {...props} />
				</>
		)
	}
}

export default WithHandleBottom