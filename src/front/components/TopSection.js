import React from 'react'
import { TOP_SECTION_ZINDEX } from '../constants'
import ReItemInput from '../containers/ReItemInput'
import ReItemPath from '../containers/ReItemPath'
import ReItemHead from '../containers/ReItemHead'
import { getItemList } from '../utility'

const TopSection = React.createClass({
    componentWillMount: function() {
        this.props.globalinput((name, exact) => (this.props.pathLength > 0 && !name) ? Promise.reject('') : getItemList(this.props.sortName, this.props.sortType, this.props.set, 0, '', false, (name ? name : null), 0, exact, this.props.multi, true))
    },
    render: function() {
        return (
            <section id="top-section" style={{float: 'left', position: 'fixed', left: '0px', width: '100%', zIndex: TOP_SECTION_ZINDEX}}>
                <ReItemInput />
                <ReItemPath />
                <ReItemHead />
            </section>
        )
    }
})

export default TopSection