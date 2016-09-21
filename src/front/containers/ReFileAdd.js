import { connect } from 'react-redux'
import { alertPush, widgetToggle } from '../actions'
import { UPLOAD } from '../constants'
import FileAdd from '../components/FileAdd'

const mapStateToProps = state => ({
    mainUrl: state.basicDataHandle.url,
    progress: state.uploadDataHandle.progress,
    show: state.widgetHandle[UPLOAD],
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    toggle: show => dispatch(widgetToggle(UPLOAD, show)),
})

const ReFileAdd = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileAdd)

export default ReFileAdd