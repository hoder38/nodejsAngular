import { COLLAPSE_TOGGLE } from '../constants'

const initialState = [true, true]

export default function collapseHandle (state = initialState, action) {
    switch (action.type) {
        case COLLAPSE_TOGGLE:
        return state.map((collapse, i) => {
            if (i === action.index) {
                return !collapse
            } else {
                return collapse
            }
        })
        default:
        return state
    }
}