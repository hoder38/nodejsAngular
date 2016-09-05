import { connect } from 'react-redux'
import { userInfoAdd, userInfoDel } from '../actions'
import UserInfo from '../components/UserInfo'

const mapDispatchToProps = dispatch => ({
    addUser: user => dispatch(userInfoAdd(user)),
    delUser: key => dispatch(userInfoDel(key)),
    addalert: msg => dispatch(alertPush(msg)),
})

const ReUserInfo = connect(
    null,
    mapDispatchToProps
)(UserInfo)

export default ReUserInfo