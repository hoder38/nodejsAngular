import { connect } from 'react-redux'
import WidgetManage from '../components/WidgetManage'

const mapStateToProps = state => ({
    uploadProgress: state.uploadDataHandle,
    feedbackNumber: state.feedbackDataHandle.size,
    musicNumber: state.itemDataHandle[4] ? state.itemDataHandle[4].list.size : 0,
})

const ReWidgetManage = connect(
    mapStateToProps
)(WidgetManage)

export default ReWidgetManage