import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { alertPush, userPush } from '../actions'
import Userlist from '../components/Userlist'

const getMemUser = createSelector(state => state.userDataHandle, user => user)

const mapStateToProps = state => ({
    user_info: getMemUser(state),
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    userset: user => dispatch(userPush(user)),
})

const ReUserlist = connect(
    mapStateToProps,
    mapDispatchToProps
)(Userlist)

export default ReUserlist
