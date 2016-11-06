import { SEND_GLB_IN, CLOSE_GLB_IN } from '../constants'

const initialState = []

export default function glbInHandle (state = initialState, action) {
    switch (action.type) {
        case SEND_GLB_IN:
        return [
            {
                callback: action.callback,
                input: action.input,
                placeholder: action.placeholder,
                color: action.color === null ? 'default' : action.color,
                value: action.value === null ? '' : action.value,
            },
            ...state.filter(i => i.input !== action.input),
        ]
        case CLOSE_GLB_IN:
        if (action.clear) {
            return []
        } else {
            let new_state = [...state]
            new_state.splice(0, 1)
            return new_state
        }
        default:
        return state
    }
}