import { connect } from 'react-redux'
import { itemPush, alertPush, setItem, sendGlbCf } from '../actions'
import Itemlist from '../components/Itemlist'

const mapStateToProps = state => ({
    item: state.itemDataHandle,
    dirs: state.dirDataHandle,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    set: (item, path, bookmark, latest, sortName, sortType, pageToken) => dispatch(itemPush(item, path, bookmark, latest, sortName, sortType, pageToken)),
    select: item => dispatch(setItem(item)),
    sendglbcf: (callback, text) => dispatch(sendGlbCf(callback, text)),
})

const ReItemlist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Itemlist)

export default ReItemlist