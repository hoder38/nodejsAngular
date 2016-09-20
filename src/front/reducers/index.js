import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import collapseHandle from './collapseHandle'
import alertHandle from './alertHandle'
import basicDataHandle from './basicDataHandle'
import uploadDataHandle from './uploadDataHandle'
import glbPwHandle from './glbPwHandle'
import glbCfHandle from './glbCfHandle'
import widgetHandle from './widgetHandle'

const ANoMoPi = combineReducers({
    routing: routerReducer,
    collapseHandle,
    alertHandle,
    basicDataHandle,
    uploadDataHandle,
    glbPwHandle,
    glbCfHandle,
    widgetHandle,
})

export default ANoMoPi