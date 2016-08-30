import { COLLAPSE_TOGGLE, ALERT_PUSH, ALERT_POP, SET_MAIN_URL } from '../constants'
import { browserHistory } from 'react-router'
import { api } from '../utility'

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