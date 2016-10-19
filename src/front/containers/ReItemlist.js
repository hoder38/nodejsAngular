import { connect } from 'react-redux'
import { itemPush, alertPush } from '../actions'
import Itemlist from '../components/Itemlist'

const mapStateToProps = state => ({
    item: state.itemDataHandle,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    set: (item, path, sortName, sortType, pageToken) => dispatch(itemPush(item, path, sortName, sortType, pageToken)),
})

const ReItemlist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Itemlist)

export default ReItemlist