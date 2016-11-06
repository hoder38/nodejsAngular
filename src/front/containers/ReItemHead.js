import { connect } from 'react-redux'
import { itemPush, alertPush, setItem, sendGlbIn } from '../actions'
import ItemHead from '../components/ItemHead'

const mapStateToProps = state => ({
    item: state.itemDataHandle,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    set: (item, path, bookmark, latest, sortName, sortType, pageToken) => dispatch(itemPush(item, path, bookmark, latest, sortName, sortType, pageToken)),
    select: item => dispatch(setItem(item)),
    globalinput: callback => dispatch(sendGlbIn(1, 'New Tag...', callback, 'danger')),
})

const ReItemHead = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemHead)

export default ReItemHead