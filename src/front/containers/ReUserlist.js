import { connect } from 'react-redux'
import { alertPush } from '../actions'
import Userlist from '../components/Userlist'

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
})

const ReUserlist = connect(
    null,
    mapDispatchToProps
)(Userlist)

export default ReUserlist
