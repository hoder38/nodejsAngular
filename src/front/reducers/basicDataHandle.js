import { SET_BASIC } from '../constants'

const initialState = {
    id: 'guest',
    url: '',
    dir: [],
}

export default function basicDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_BASIC:
        const id = action.id === null ? state.id : action.id
        const url = action.url === null ? state.url : action.url
        const dir = action.dir === null ? state.dir : action.dir
        return {
            id,
            url,
            dir,
        }
        default:
        return state
    }
}