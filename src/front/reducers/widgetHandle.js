import { WIDGET_TOGGLE, UPLOAD, FEEDBACK } from '../constants'

const initialState = {
    [UPLOAD]: false,
    [FEEDBACK]: false,
}

export default function widgetHandle (state = initialState, action) {
    switch (action.type) {
        case WIDGET_TOGGLE:
        switch (action.widget) {
            case UPLOAD:
            case FEEDBACK:
            return Object.assign({}, state, {
                [action.widget]: !state[action.widget],
            })
            default:
            return state
        }
        default:
        return state
    }
}