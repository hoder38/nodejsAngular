import { connect } from 'react-redux'
import { alertPush, sendGlbPw, setBasic, sendGlbCf } from '../actions'
import UserInfo from '../components/UserInfo'

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    sendglbpw: callback => dispatch(sendGlbPw(callback)),
    setbasic: id => dispatch(setBasic(id)),
    sendglbcf: (callback, text) => dispatch(sendGlbCf(callback, text)),
})

const ReUserInfo = connect(
    null,
    mapDispatchToProps
)(UserInfo)

export default ReUserInfo