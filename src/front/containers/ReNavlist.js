import { connect } from 'react-redux'
import Navlist from '../components/Navlist'

const mapStateToProps = state => ({
    collapse: state.collapseHandle[0],
})

const ReNavlist = connect(
    mapStateToProps
)(Navlist)

export default ReNavlist