import { connect } from 'react-redux'
import { closeGlbIn, alertPush } from '../actions'
import ItemInput from '../components/ItemInput'

const mapStateToProps = state => state.glbInHandle.length > 0 ? {
    input: state.glbInHandle[0].input,
    callback: state.glbInHandle[0].callback,
    color: state.glbInHandle[0].color,
    placeholder: state.glbInHandle[0].placeholder,
    value: state.glbInHandle[0].value,
    placeholder2: state.glbInHandle[0].placeholder2,
    index: state.glbInHandle[0].index,
} : {
    input: 0,
    callback: () => {},
    color: '',
    placeholder: '',
    value: '',
    placeholder2: '',
    index: -1,
}

const mapDispatchToProps = dispatch => ({
    inputclose: clear => dispatch(closeGlbIn(clear)),
    addalert: msg => dispatch(alertPush(msg)),
})

const ReItemInput = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemInput)

export default ReItemInput