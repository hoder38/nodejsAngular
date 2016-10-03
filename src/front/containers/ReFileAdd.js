import { connect } from 'react-redux'
import { alertPush, feedbackPush } from '../actions'
import FileAdd from '../components/FileAdd'

const mapStateToProps = state => ({
    mainUrl: state.basicDataHandle.url,
    progress: state.uploadDataHandle,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    pushfeedback: feedback => dispatch(feedbackPush(feedback)),
})

const ReFileAdd = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileAdd)

export default ReFileAdd