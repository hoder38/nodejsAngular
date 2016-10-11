import { connect } from 'react-redux'
import { bookmarkPush, bookmarkPop, dirPush, dirPop } from '../actions'
import Categorylist from '../components/Categorylist'

const mapStateToProps = state => ({
    edit: state.basicDataHandle.edit,
    bookmark: state.bookmarkDataHandle,
    dirs: state.dirDataHandle,
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
