import { SET_BASIC } from '../constants'

const initialState = {
    id: 'guest',
    url: '',
    edit: false,
}

export default function basicDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_BASIC:
        const id = action.id === null ? state.id : action.id
        const url = action.url === null ? state.url : action.url
        const edit = action.edit === null ? state.edit : action.edit
        return {
            id,
            url,
            edit,
        }
        default:
        return state
    }
}