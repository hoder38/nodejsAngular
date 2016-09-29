import { connect } from 'react-redux'
import { setUpload, alertPush } from '../actions'
import FileUploader from '../components/FileUploader'

const mapDispatchToProps = dispatch => ({
    setUpload: progress => dispatch(setUpload(progress)),
    addalert: msg => dispatch(alertPush(msg)),
})

const ReFileUploader = connect(
    null,
    mapDispatchToProps
)(FileUploader)

export default ReFileUploader