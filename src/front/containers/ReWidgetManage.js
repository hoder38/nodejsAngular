import { connect } from 'react-redux'
import { widgetToggle } from '../actions'
import WidgetManage from '../components/WidgetManage'

const mapStateToProps = state => ({
    uploadProgress: state.uploadDataHandle.progress,
})

const mapDispatchToProps = dispatch => ({
    toggle: widget => dispatch(widgetToggle(widget)),
})

const ReWidgetManage = connect(
    mapStateToProps,
    mapDispatchToProps
)(WidgetManage)

export default ReWidgetManage