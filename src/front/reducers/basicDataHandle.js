import { SET_BASIC } from '../constants'

const initialState = {
    id: 'guest',
    url: '',
}

export default function basicDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_BASIC:
        return Object.assign({}, state, {
            id: action.id,
            url: action.url})
        return action.url
        default:
        return state
    }
}