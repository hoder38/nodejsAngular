import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { bookmarkPush, bookmarkPop, dirPush, dirPop } from '../actions'
import Categorylist from '../components/Categorylist'

const getMemBookmark = createSelector(state => state.bookmarkDataHandle, bookmark => bookmark)
const getMemDirs = createSelector(state => state.dirDataHandle, dirs => dirs)

const mapStateToProps = state => ({
    edit: state.basicDataHandle.edit,
    bookmark: getMemBookmark(state),
    dirs: getMemDirs(state),
})

const mapDispatchToProps = dispatch => ({
    bookmarkset: (bookmark, sortName, sortType) => dispatch(bookmarkPush(bookmark, sortName, sortType)),
    delbookmark: id => dispatch(bookmarkPop(id)),
    dirset: (name, dir, sortName, sortType) => dispatch(dirPush(name, dir, sortName, sortType)),
    deldir: (name, id) => dispatch(dirPop(name, id)),
})

const ReCategorylist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Categorylist)

export default ReCategorylist
