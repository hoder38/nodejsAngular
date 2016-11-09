import { connect } from 'react-redux'
import { setItem, alertPush, sendGlbIn, feedbackPush, sendGlbCf, bookmarkPush, itemPush } from '../actions'
import ItemFile from '../components/ItemFile'

const mapStateToProps = state => ({
    list: state.itemDataHandle.list,
    sortName: state.itemDataHandle.sortName,
    sortType: state.itemDataHandle.sortType,
    mainUrl: state.basicDataHandle.url,
    bookmark: state.itemDataHandle.bookmark,
})

const mapDispatchToProps = dispatch => ({
    setLatest: id => dispatch(setItem(null, id)),
    addalert: msg => dispatch(alertPush(msg)),
    globalinput: (type, callback, color, placeholder, value, placeholder2) => dispatch(sendGlbIn(type, callback, color, placeholder, value, placeholder2)),
    pushfeedback: feedback => dispatch(feedbackPush(feedback)),
    sendglbcf: (callback, text) => dispatch(sendGlbCf(callback, text)),
    pushbookmark: bookmark => dispatch(bookmarkPush(bookmark)),
    set: (item, path, bookmark, latest, sortName, sortType, pageToken) => dispatch(itemPush(item, path, bookmark, latest, sortName, sortType, pageToken)),
})

const ReItemFile = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemFile)

export default ReItemFile