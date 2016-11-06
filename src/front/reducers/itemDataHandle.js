import { ITEM_POP, ITEM_PUSH, SET_ITEM } from '../constants'
import { arrayObjectPush } from '../utility'

const initialState = {
    list: [],
    sortName: 'name',
    sortType: 'asc',
    page: 0,
    more: true,
    pageToken: '',
    multi: false,
    path: {
        cur: [],
        exactly: [],
        his: [],
    },
    latest: '',
    bookmark: '',
}

const rest_item = (item, orig=null) => {
    let date = new Date(item.utime * 1000)
    item.utime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    item.select = orig&&orig.select ? orig.select : false
    return item
}

export default function itemDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_ITEM:
        return Object.assign({}, state, {
            list: action.item === null ? state.list : action.item,
            latest: action.latest === null ? state.latest : action.latest,
        })
        case ITEM_PUSH:
        if (action.sortName !== null && action.sortType !== null) {
            window.scrollTo(0, 0)
            return Object.assign({}, state, {
                list: action.item.map(item => rest_item(item)),
                sortName: action.sortName,
                sortType: action.sortType,
                page: action.item.length,
                more: (action.item.length === 0) ? false : true,
                path: action.path === null ? state.path : action.path,
                latest: action.latest === null ? '' : action.latest,
                bookmark: action.bookmark === null ? '' : action.bookmark,
            })
        } else {
            if (action.item === true || action.item === false) {
                return Object.assign({}, state, {multi: action.item})
            } else {
                if (action.pageToken === null) {
                    return Object.assign({}, state, {
                        page: action.item.length ? state.page + action.item.length : state.page,
                        more: (Array.isArray(action.item) && action.item.length === 0) ? false : true,
                        list: arrayObjectPush(state.list, action.item, 'id', rest_item),
                        path: action.path === null ? state.path : action.path,
                        latest: action.latest === null ? '' : action.latest,
                        bookmark: action.bookmark === null ? '' : action.bookmark,
                    })
                } else {
                    return (action.path === state.path) ? Object.assign({}, state, {
                        more: (!state.more && action.item.length === 0) ? false : true,
                        list: arrayObjectPush(state.list, action.item, 'id', rest_item),
                        pageToken: action.pageToken,
                    }) : state
                }
            }
        }
        case ITEM_POP:
        return Object.assign({}, state, {list: state.list.filter(item => item.id !== item.id)})
        default:
        return state
    }
}