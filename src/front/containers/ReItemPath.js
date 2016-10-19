import { connect } from 'react-redux'
import { itemPush, alertPush, bookmarkPush, feedbackPush } from '../actions'
import ItemPath from '../components/ItemPath'

const mapStateToProps = state => ({
    current: state.itemDataHandle.path.cur ? state.itemDataHandle.path.cur : [],
    history: state.itemDataHandle.path.his ? state.itemDataHandle.path.his : [],
    exact: state.itemDataHandle.path.exactly ? state.itemDataHandle.path.exactly : [],
    sortName: state.itemDataHandle.sortName,
    sortType: state.itemDataHandle.sortType,
    multi: state.itemDataHandle.multi,
    bookmark: state.bookmarkDataHandle.list,
})

const mapDispatchToProps = dispatch => ({
    multiToggle: item => dispatch(itemPush(item)),
    addalert: msg => dispatch(alertPush(msg)),
    set: (item, path, sortName, sortType, pageToken) => dispatch(itemPush(item, path, sortName, sortType, pageToken)),
    pushbookmark: bookmark => dispatch(bookmarkPush(bookmark)),
    pushfeedback: feedback => dispatch(feedbackPush(feedback)),
})

const ReItemPath = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemPath)

export default ReItemPath