import {
	SET_SINGER
} from './actions'

export default {
	singer(state=null, action) {
		const { type, payload } = action
		switch (type) {
			case SET_SINGER:
				return payload
			default:
		}
		return state
	}
}