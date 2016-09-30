import { connect } from 'react-redux'
import WidgetManage from '../components/WidgetManage'

const mapStateToProps = state => ({
    uploadProgress: state.uploadDataHandle,
    feedbackNumber: state.feedbackDataHandle.length,
})

const ReWidgetManage = connect(
    mapStateToProps
)(WidgetManage)

export default ReWidgetManage