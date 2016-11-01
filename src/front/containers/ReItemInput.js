import { connect } from 'react-redux'
import { closeGlbIn, alertPush } from '../actions'
import ItemInput from '../components/ItemInput'

const mapStateToProps = state => ({
    glbIn: state.glbInHandle[0],
})

const mapDispatchToProps = dispatch => ({
    inputclose: clear => dispatch(closeGlbIn(clear)),
    addalert: msg => dispatch(alertPush(msg)),
})

const ReItemInput = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemInput)

export default ReItemInput