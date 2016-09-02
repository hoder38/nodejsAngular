import { COLLAPSE_TOGGLE, ALERT_PUSH, ALERT_POP, SET_MAIN_URL, USER_INFO_ADD
    , USER_INFO_POP } from '../constants'

export const collapseToggle = index => ({
    type: COLLAPSE_TOGGLE,
    index,
})

export const alertPush = msg => ({
    type: ALERT_PUSH,
    msg,
})

export const alertPop = key => ({
    type: ALERT_POP,
    key,
})

export const setMainUrl = url => ({
    type: SET_MAIN_URL,
    url,
})

export const userInfoAdd = user => ({
    type: USER_INFO_ADD,
    user,
})

export const userInfoPop = key => ({
    type: USER_INFO_POP,
    key,
})