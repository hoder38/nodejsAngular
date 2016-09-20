import { connect } from 'react-redux'
import { setUpload } from '../actions'
import FileUploader from '../components/FileUploader'

const mapDispatchToProps = dispatch => ({
    setPush: pushFile => dispatch(setUpload(null, null, pushFile)),
    setProgress: (progress, uploading) => dispatch(setUpload(progress, uploading)),
})

const ReFileUploader = connect(
    null,
    mapDispatchToProps
)(FileUploader)

export default ReFileUploader