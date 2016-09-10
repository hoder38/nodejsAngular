import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import collapseHandle from './collapseHandle'
import alertHandle from './alertHandle'
import basicDataHandle from './basicDataHandle'
import glbPwHandle from './glbPwHandle'
import glbCfHandle from './glbCfHandle'

const ANoMoPi = combineReducers({
    routing: routerReducer,
    collapseHandle,
    alertHandle,
    basicDataHandle,
    glbPwHandle,
    glbCfHandle,
})

export default ANoMoPi