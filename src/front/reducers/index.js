import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { FEEDBACK_POP, FEEDBACK_PUSH, USER_POP, USER_PUSH } from '../constants'
import alertHandle from './alertHandle'
import basicDataHandle from './basicDataHandle'
import uploadDataHandle from './uploadDataHandle'
import simpleDataHandle from './simpleDataHandle'
import bookmarkDataHandle from './bookmarkDataHandle'
import dirDataHandle from './dirDataHandle'
import itemDataHandle from './itemDataHandle'
import glbPwHandle from './glbPwHandle'
import glbCfHandle from './glbCfHandle'

const feedbackDataHandle = simpleDataHandle(FEEDBACK_PUSH, FEEDBACK_POP)
const userDataHandle = simpleDataHandle(USER_PUSH, USER_POP)

const ANoMoPi = combineReducers({
    routing: routerReducer,
    alertHandle,
    basicDataHandle,
    uploadDataHandle,
    feedbackDataHandle,
    userDataHandle,
    bookmarkDataHandle,
    dirDataHandle,
    itemDataHandle,
    glbPwHandle,
    glbCfHandle,
})

export default ANoMoPi