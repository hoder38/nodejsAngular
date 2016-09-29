import { connect } from 'react-redux'
import { alertPush, feedbackPop, setFeedback } from '../actions'
import FileFeedback from '../components/FileFeedback'

const mapStateToProps = state => state.feedbackDataHandle.length > 0 ? {
        dirs: state.basicDataHandle.dir,
        mainUrl: state.basicDataHandle.url,
        id: state.feedbackDataHandle[0].id,
        name: state.feedbackDataHandle[0].name,
        select: state.feedbackDataHandle[0].select,
        option: state.feedbackDataHandle[0].option,
        other: state.feedbackDataHandle[0].other,
    } : {
        dirs: state.basicDataHandle.dir,
        id: '',
        name: '',
        select: [],
        option: [],
        other: [],
    }

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    handlefeedback: id => dispatch(feedbackPop(id)),
    feedbackset: feedback => dispatch(setFeedback(feedback)),
})

const ReFileFeedback = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileFeedback)

export default ReFileFeedback