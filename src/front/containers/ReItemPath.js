import { connect } from 'react-redux'
import { itemPush, alertPush, bookmarkPush, feedbackPush, sendGlbIn } from '../actions'
import ItemPath from '../components/ItemPath'

const mapStateToProps = state => ({
    current: state.itemDataHandle.path.cur,
    history: state.itemDataHandle.path.his,
    exact: state.itemDataHandle.path.exactly,
    sortName: state.itemDataHandle.sortName,
    sortType: state.itemDataHandle.sortType,
    multi: state.itemDataHandle.multi,
    bookmark: state.bookmarkDataHandle.list,
})

const mapDispatchToProps = dispatch => ({
    multiToggle: item => dispatch(itemPush(item)),
    addalert: msg => dispatch(alertPush(msg)),
    set: (item, path, bookmark, latest, sortName, sortType, pageToken) => dispatch(itemPush(item, path, bookmark, latest, sortName, sortType, pageToken)),
    pushbookmark: bookmark => dispatch(bookmarkPush(bookmark)),
    pushfeedback: feedback => dispatch(feedbackPush(feedback)),
    globalinput: callback => dispatch(sendGlbIn(1, callback, 'default', 'New Bookmark...')),
})

const ReItemPath = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemPath)

export default ReItemPath