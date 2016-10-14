import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { alertPush, feedbackPop, feedbackPush } from '../actions'
import FileFeedback from '../components/FileFeedback'

const getMemDirs = createSelector(state => state.dirDataHandle, dirs => dirs)

const mapStateToProps = state => state.feedbackDataHandle.length > 0 ? {
        dirs: getMemDirs(state),
        mainUrl: state.basicDataHandle.url,
        id: state.feedbackDataHandle[0].id,
        name: state.feedbackDataHandle[0].name,
        select: state.feedbackDataHandle[0].select,
        option: state.feedbackDataHandle[0].option,
        other: state.feedbackDataHandle[0].other,
    } : {
        dirs: getMemDirs(state),
        mainUrl: state.basicDataHandle.url,
        id: '',
        name: '',
        select: [],
        option: [],
        other: [],
    }

const mapDispatchToProps = dispatch => ({
    addalert: msg => dispatch(alertPush(msg)),
    handlefeedback: id => dispatch(feedbackPop(id)),
    feedbackset: feedback => dispatch(feedbackPush(feedback)),
})

const ReFileFeedback = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileFeedback)

export default ReFileFeedback