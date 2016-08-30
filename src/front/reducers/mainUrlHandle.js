import { SET_MAIN_URL } from '../constants'

const initialState = ''

export default function mainUrlHandle (state = initialState, action) {
    switch (action.type) {
        case SET_MAIN_URL:
            return action.url
        default:
            return state
    }
}