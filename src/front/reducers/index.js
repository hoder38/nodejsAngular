import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import collapseHandle from './collapseHandle'
import alertHandle from './alertHandle'
import mainUrlHandle from './mainUrlHandle'
import userInfoHandle from './userInfoHandle'

const ANoMoPi = combineReducers({
    routing: routerReducer,
    collapseHandle,
    alertHandle,
    mainUrlHandle,
    userInfoHandle,
})

export default ANoMoPi