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
            const show = action.show === null ? !state[action.widget] : action.show
            return Object.assign({}, state, {
                [action.widget]: show,
            })
            default:
            return state
        }
        default:
        return state
    }
}