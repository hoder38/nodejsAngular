import { connect } from 'react-redux'
import { bookmarkPush, bookmarkPop, dirPush, dirPop, itemPush } from '../actions'
import Categorylist from '../components/Categorylist'

const mapStateToProps = state => ({
    sortName: state.itemDataHandle.sortName,
    sortType: state.itemDataHandle.sortType,
    multi: state.itemDataHandle.multi,
    edit: state.basicDataHandle.edit,
    bookmark: state.bookmarkDataHandle,
    dirs: state.dirDataHandle,
})

const mapDispatchToProps = dispatch => ({
    bookmarkset: (bookmark, sortName, sortType) => dispatch(bookmarkPush(bookmark, sortName, sortType)),
    delbookmark: id => dispatch(bookmarkPop(id)),
    dirset: (name, dir, sortName, sortType) => dispatch(dirPush(name, dir, sortName, sortType)),
    deldir: (name, id) => dispatch(dirPop(name, id)),
    set: (item, path, bookmark, latest, sortName, sortType, pageToken) => dispatch(itemPush(item, path, bookmark, latest, sortName, sortType, pageToken)),
})

const ReCategorylist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Categorylist)

export default ReCategorylist
