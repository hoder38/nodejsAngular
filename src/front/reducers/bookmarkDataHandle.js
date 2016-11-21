import { BOOKMARK_POP, BOOKMARK_PUSH } from '../constants'
import { arrayObject } from '../utility'

const initialState = {
    list: new Map(),
    sortName: 'name',
    sortType: 'asc',
    page: 0,
    more: false,
}

export default function bookmarkDataHandle (state = initialState, action) {
    switch (action.type) {
        case BOOKMARK_PUSH:
        return (action.sortName !== null && action.sortType !== null) ? Object.assign({}, state, {
            list: arrayObject('push', [], action.bookmark, 'id'),
            sortName: action.sortName,
            sortType: action.sortType,
        }) : Object.assign({}, state, {list: arrayObject('push', state.list, action.bookmark, 'id')})
        case BOOKMARK_POP:
        return Object.assign({}, state, {list: arrayObject('pop', state.list, action.id)})
        default:
        return state
    }
}