import { connect } from 'react-redux'
import WidgetManage from '../components/WidgetManage'

const mapStateToProps = state => ({
    uploadProgress: state.uploadDataHandle,
})

const ReWidgetManage = connect(
    mapStateToProps
)(WidgetManage)

export default ReWidgetManage