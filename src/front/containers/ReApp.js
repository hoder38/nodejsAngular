import { connect } from 'react-redux'
import { alertPush, setBasic, sendGlbCf, feedbackPush, bookmarkPush, setDirs, userPush, itemPush, dirPush } from '../actions'
import App from '../components/App'

const mapStateToProps = state => ({
    id: state.basicDataHandle.id,
    pwCallback: state.glbPwHandle,
    cfCallback: state.glbCfHandle,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    basicset: (id, url, edit) => dispatch(setBasic(id, url, edit)),
    sendglbcf: (callback, text) => dispatch(sendGlbCf(callback, text)),
    feedbackset: feedback => dispatch(feedbackPush(feedback)),
    userset: user => dispatch(userPush(user)),
    bookmarkset: (bookmark, sortName, sortType) => dispatch(bookmarkPush(bookmark, sortName, sortType)),
    itemset: (item, sortName, sortType) => dispatch(itemPush(item, sortName, sortType)),
    dirsset: (dirs, rest) => dispatch(setDirs(dirs, rest)),
    pushdir: (name, dir) => dispatch(dirPush(name, dir)),
})

const ReApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default ReApp