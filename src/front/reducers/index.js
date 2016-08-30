import { combineReducers } from 'redux'
import count from './count'
import collapseHandle from './collapseHandle'
import alertHandle from './alertHandle'
import mainUrlHandle from './mainUrlHandle'
import { routerReducer } from 'react-router-redux'

const ANoMoPi = combineReducers({
    count,
    collapseHandle,
    alertHandle,
    mainUrlHandle,
    routing: routerReducer
})

export default ANoMoPi