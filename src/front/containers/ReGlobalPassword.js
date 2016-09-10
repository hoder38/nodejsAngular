import { connect } from 'react-redux'
import { closeGlbPw } from '../actions'
import GlobalPassword from '../components/GlobalPassword'

const mapDispatchToProps = dispatch => ({
    onclose: () => dispatch(closeGlbPw()),
})

const ReGlobalPassword = connect(
    null,
    mapDispatchToProps
)(GlobalPassword)

export default ReGlobalPassword