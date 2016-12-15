import { connect } from 'react-redux'
import { alertPush, sendGlbCf, sendGlbPw, sendGlbIn, setPass } from '../actions'
import ItemPassword from '../components/ItemPassword'

const mapStateToProps = state => ({
    bookmark: state.passDataHandle.item.bookmark,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    sendglbcf: (callback, text) => dispatch(sendGlbCf(callback, text)),
    sendglbpw: callback => dispatch(sendGlbPw(callback)),
    globalinput: (type, callback, color, placeholder, value, placeholder2) => dispatch(sendGlbIn(type, callback, color, placeholder, value, placeholder2)),
    setLatest: (id, bookmark) => dispatch(setPass(null, id, bookmark)),
})

const ReItemPassword = connect(
    null,
    mapDispatchToProps
)(ItemPassword)

export default ReItemPassword