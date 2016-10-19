import { connect } from 'react-redux'
import { itemPush, alertPush } from '../actions'
import ItemHead from '../components/ItemHead'

const mapStateToProps = state => ({
    sortName: state.itemDataHandle.sortName,
    sortType: state.itemDataHandle.sortType,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    set: (item, path, sortName, sortType, pageToken) => dispatch(itemPush(item, path, sortName, sortType, pageToken)),
})

const ReItemHead = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemHead)

export default ReItemHead