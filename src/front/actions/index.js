import { ALERT_PUSH, ALERT_POP, SET_BASIC, SET_UPLOAD, SEND_GLB_PW, CLOSE_GLB_PW, SEND_GLB_CF,
    CLOSE_GLB_CF, FEEDBACK_POP, FEEDBACK_PUSH, BOOKMARK_POP, BOOKMARK_PUSH, SET_DIRS, DIR_POP,
    DIR_PUSH, USER_POP, USER_PUSH, ITEM_PUSH, ITEM_POP } from '../constants'

export const alertPush = msg => ({
    type: ALERT_PUSH,
    msg,
})

export const alertPop = key => ({
    type: ALERT_POP,
    key,
})

export const setBasic = (id=null, url=null, edit=null) => ({
    type: SET_BASIC,
    id,
    url,
    edit,
})

export const setUpload = progress => ({
    type: SET_UPLOAD,
    progress,
})

export const sendGlbPw = callback => ({
    type: SEND_GLB_PW,
    callback,
})

export const closeGlbPw = () => ({
    type: CLOSE_GLB_PW,
})

export const sendGlbCf = (callback, text) => ({
    type: SEND_GLB_CF,
    callback,
    text,
})

export const closeGlbCf = () => ({
    type: CLOSE_GLB_CF,
})

export const feedbackPop = id => ({
    type: FEEDBACK_POP,
    id,
})

export const feedbackPush = simple => ({
    type: FEEDBACK_PUSH,
    simple,
})

export const bookmarkPop = id => ({
    type: BOOKMARK_POP,
    id,
})

export const bookmarkPush = (bookmark, sortName=null, sortType=null) => ({
    type: BOOKMARK_PUSH,
    bookmark,
    sortName,
    sortType,
})

export const setDirs = dirs => ({
    type: SET_DIRS,
    dirs,
})

export const dirPop = (name, id) => ({
    type: DIR_POP,
    name,
    id,
})

export const dirPush = (name, dir, sortName=null, sortType=null) => ({
    type: DIR_PUSH,
    name,
    dir,
    sortName,
    sortType,
})

export const userPop = id => ({
    type: USER_POP,
    id,
})

export const userPush = simple => ({
    type: USER_PUSH,
    simple,
})

export const itemPop = id => ({
    type: ITEM_POP,
    id,
})

export const itemPush = item => ({
    type: ITEM_PUSH,
    item,
})

