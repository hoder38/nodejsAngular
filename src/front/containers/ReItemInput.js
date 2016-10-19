import { connect } from 'react-redux'
import { itemPush, alertPush } from '../actions'
import ItemInput from '../components/ItemInput'

const mapStateToProps = state => ({
    sortName: state.itemDataHandle.sortName,
    sortType: state.itemDataHandle.sortType,
    multi: state.itemDataHandle.multi,
    pathLength: state.itemDataHandle.path.cur ? state.itemDataHandle.path.cur.length : 0,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    set: (item, path, sortName, sortType, pageToken) => dispatch(itemPush(item, path, sortName, sortType, pageToken)),
})

const ReItemInput = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemInput)

export default ReItemInput