import { SET_BASIC } from '../constants'

const initialState = {
    id: 'guest',
    url: '',
}

export default function basicDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_BASIC:
        let id = action.id === null ? state.id : action.id
        let url = action.url === null ? state.url : action.url
        return Object.assign({}, state, {
            id,
            url,
        })
        default:
        return state
    }
}