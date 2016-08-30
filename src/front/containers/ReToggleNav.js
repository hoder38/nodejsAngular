import { connect } from 'react-redux'
import { collapseToggle } from '../actions'
import ToggleNav from '../components/ToggleNav'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onclick: () => dispatch(collapseToggle(ownProps.index))
})

const ReToggleNav = connect(
    null,
    mapDispatchToProps
)(ToggleNav)

export default ReToggleNav