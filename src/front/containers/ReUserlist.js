import { connect } from 'react-redux'
import { userInfoAdd } from '../actions'
import Userlist from '../components/Userlist'

const mapStateToProps = state => ({
    user_info: state.userInfoHandle,
})

const mapDispatchToProps = dispatch => ({
    addUsers: users => dispatch(userInfoAdd(users)),
    addalert: msg => dispatch(alertPush(msg)),
})

const ReUserlist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Userlist)

export default ReUserlist
