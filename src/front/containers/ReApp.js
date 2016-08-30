import { connect } from 'react-redux'
import { alertPush, setMainUrl } from '../actions'
import App from '../components/App'

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    mainurlset: url => dispatch(setMainUrl(url)),
})

const ReApp = connect(
    null,
    mapDispatchToProps
)(App)

export default ReApp