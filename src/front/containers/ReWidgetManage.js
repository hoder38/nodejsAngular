import { connect } from 'react-redux'
import WidgetManage from '../components/WidgetManage'

const mapStateToProps = state => ({
    uploadProgress: state.uploadDataHandle,
    feedbackNumber: state.feedbackDataHandle.size,
    videoNumber: state.itemDataHandle[3] ? state.itemDataHandle[3].list.size : 0,
    videoMore: state.itemDataHandle[3] ? state.itemDataHandle[3].more : false,
    musicNumber: state.itemDataHandle[4] ? state.itemDataHandle[4].list.size : 0,
    musicMore: state.itemDataHandle[4] ? state.itemDataHandle[4].more : false,
})

const ReWidgetManage = connect(
    mapStateToProps
)(WidgetManage)

export default ReWidgetManage