import React from 'react'
import ReDirlist from '../containers/ReDirlist'
import { RIGHT_SECTION_ZINDEX } from '../constants'

const Categorylist = React.createClass({
    getInitialState: function() {
        return {
            collapse: true,
        }
    },
    componentDidMount: function() {
        this._targetArr = Array.from(document.querySelectorAll('[data-collapse]')).filter(node => node.getAttribute('data-collapse') === this.props.collapse)
        if (this._targetArr.length > 0) {
            this._targetArr.forEach(target => {
                target.addEventListener('click', this._toggle)
            })
        }
    },
    componentWillUnmount: function() {
        if (this._targetArr.length > 0) {
            this._targetArr.forEach(target => {
                target.removeEventListener('click', this._toggle)
            })
        }
    },
    _toggle: function() {
        this.setState({collapse: !this.state.collapse})
    },
    render: function() {
        let rows = []
        this.props.dirs.forEach(dir => rows.push(
            <ReDirlist name={dir.title} time="qtime" dir={dir} set={(item, sortName, sortType) => this.props.dirset(dir.name, item, sortName, sortType)} del={id => this.props.deldir(dir.name, id)} listUrl={`${this.props.dirUrl}${dir.name}/`} delUrl={this.props.dirDelUrl} edit={this.props.edit} collapse={true} key={dir.key} />
        ))
        return (
            <nav className="navbar-inverse" style={{width: '100%', position: 'fixed', zIndex: RIGHT_SECTION_ZINDEX}}>
                <div className={this.state.collapse ? 'navbar-collapse collapse' : 'navbar-collapse collapse in'}>
                    <ul className="nav navbar-nav side-nav" id="inverse-nav" style={{right: '0px', left: 'auto', overflowX: 'hidden', overflowY: 'auto'}}>
                        <ReDirlist name="Bookmark" time="mtime" dir={this.props.bookmark} set={this.props.bookmarkset} del={this.props.delbookmark} listUrl={this.props.bookUrl} delUrl={this.props.bookDelUrl} edit={true} collapse={false} />
                        {rows}
                    </ul>
                </div>
            </nav>
        )
    }
})

export default Categorylist