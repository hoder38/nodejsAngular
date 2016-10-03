import { connect } from 'react-redux'
import { setUpload, alertPush, feedbackPush } from '../actions'
import FileUploader from '../components/FileUploader'

const mapDispatchToProps = dispatch => ({
    setUpload: progress => dispatch(setUpload(progress)),
    addalert: msg => dispatch(alertPush(msg)),
    pushfeedback: feedback => dispatch(feedbackPush(feedback)),
})

const ReFileUploader = connect(
    null,
    mapDispatchToProps
)(FileUploader)

export default ReFileUploader