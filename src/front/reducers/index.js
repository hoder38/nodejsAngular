import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import alertHandle from './alertHandle'
import basicDataHandle from './basicDataHandle'
import uploadDataHandle from './uploadDataHandle'
import feedbackDataHandle from './feedbackDataHandle'
import glbPwHandle from './glbPwHandle'
import glbCfHandle from './glbCfHandle'

const ANoMoPi = combineReducers({
    routing: routerReducer,
    alertHandle,
    basicDataHandle,
    uploadDataHandle,
    feedbackDataHandle,
    glbPwHandle,
    glbCfHandle,
})

export default ANoMoPi