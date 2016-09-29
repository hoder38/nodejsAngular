import { connect } from 'react-redux'
import { alertPush, setBasic, sendGlbCf, setFeedback } from '../actions'
import App from '../components/App'

const mapStateToProps = state => ({
    id: state.basicDataHandle.id,
    pwCallback: state.glbPwHandle,
    cfCallback: state.glbCfHandle,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    basicset: (id, url, dir) => dispatch(setBasic(id, url, dir)),
    sendglbcf: (callback, text) => dispatch(sendGlbCf(callback, text)),
    feedbackset: feedback => dispatch(setFeedback(feedback)),
})

const ReApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default ReApp