import { arrayObjectPush } from '../utility'

const initialState = []

export default function simpleDataHandle (push, pop) {
    return (state = initialState, action) => {
        switch (action.type) {
            case push:
            return Array.isArray(action.simple) ? action.simple : arrayObjectPush(state, action.simple, 'id')
            case pop:
            return state.filter(simple => simple.id !== action.id)
            default:
            return state
        }
    }
}
