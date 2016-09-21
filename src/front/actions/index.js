import { COLLAPSE_TOGGLE, ALERT_PUSH, ALERT_POP, SET_BASIC, SET_UPLOAD, SEND_GLB_PW,
    CLOSE_GLB_PW, SEND_GLB_CF, CLOSE_GLB_CF, WIDGET_TOGGLE } from '../constants'

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

export const setBasic = (id=null, url=null) => ({
    type: SET_BASIC,
    id,
    url,
})

export const setUpload = (progress=null, uploading=null, pushFile=null) => ({
    type: SET_UPLOAD,
    progress,
    uploading,
    pushFile,
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

export const widgetToggle = (widget, show=null) => ({
    type: WIDGET_TOGGLE,
    widget,
    show,
})
