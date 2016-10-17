import { BOOKMARK_POP, BOOKMARK_PUSH } from '../constants'
import { arrayObjectPush } from '../utility'

const initialState = {
    list: [],
    sortName: 'name',
    sortType: 'asc',
    page: 0,
    more: false,
}

export default function bookmarkDataHandle (state = initialState, action) {
    switch (action.type) {
        case BOOKMARK_PUSH:
        if (action.sortName !== null && action.sortType !== null) {
            return Object.assign({}, state, {
                list: action.bookmark,
                sortName: action.sortName,
                sortType: action.sortType,
            })
        } else {
            return Object.assign({}, state, {list: arrayObjectPush(state.list, action.bookmark, 'id')})
        }
        case BOOKMARK_POP:
        return Object.assign({}, state, {list: state.list.filter(bookmark => bookmark.id !== action.id)})
        default:
        return state
    }
}