import { SET_DIRS, DIR_POP, DIR_PUSH } from '../constants'
import { arrayObjectPush } from '../utility'

const initialState = []

export default function dirDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_DIRS:
        return action.dirs.map(dir => {
            dir['list'] = []
            dir['sortName'] = 'name'
            dir['sortType'] = 'asc'
            dir['page'] = 0
            return dir
        })
        case DIR_PUSH:
        if (action.sortName !== null && action.sortType !== null) {
            return state.map(dir => dir.name === action.name ? Object.assign({}, dir, {
                list: action.dir,
                sortName: action.sortName,
                sortType: action.sortType,
                page: action.dir.length,
            }) : dir)
        } else {
            return state.map(dir => dir.name === action.name ? Object.assign({}, dir, {
                list: arrayObjectPush(dir.list, action.dir, 'id'),
                page: action.dir.length ? dir.page + action.dir.length : dir.page,
            }) : dir)
        }
        case DIR_POP:
        return state.map(dir => dir.name === action.name ? Object.assign({}, dir, {
            list: dir.list.filter(item => item.id !== action.id),
            page: dir.page - 1,
        }) : dir)
        default:
        return state
    }
}