import { connect } from 'react-redux'
import { alertPush, setBasic } from '../actions'
import App from '../components/App'

const mapStateToProps = state => ({
    id: state.basicDataHandle.id,
    pwCallback: state.glbPwHandle,
    cfCallback: state.glbCfHandle,
    pushFile: state.uploadDataHandle.pushFile,
    uploading: state.uploadDataHandle.uploading,
})

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    basicset: (id,url) => dispatch(setBasic(id, url)),
})

const ReApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default ReApp