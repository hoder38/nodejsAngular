import React from 'react'
import ReDirlist from '../containers/ReDirlist'
import RePasswordInfo from '../containers/RePasswordInfo'
import { RIGHT_SECTION_ZINDEX, PASSWORD } from '../constants'
import { dirItemList, bookmarkItemList, killEvent } from '../utility'

const Categorylist = React.createClass({
    getInitialState: function() {
        return {
            collapse: true,
            edit: false,
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
    _toggle: function(e) {
        killEvent(e, () => this.setState(Object.assign({}, this.state, {collapse: !this.state.collapse})))
    },
    _dirItem: function(id) {
        dirItemList(this.props.itemType, this.props.sortName, this.props.sortType, this.props.set, id, this.props.multi).catch(err => this.props.addalert(err))
    },
    _bookmarkItem: function(id) {
        bookmarkItemList(this.props.itemType, 'get', this.props.sortName, this.props.sortType, this.props.set, id).catch(err => this.props.addalert(err))
    },
    render: function() {
        let rows = []
        this.props.dirs.forEach(dir => rows.push(
            <ReDirlist name={dir.title} time="qtime" dir={dir} set={(item, sortName, sortType) => this.props.dirset(dir.name, item, sortName, sortType)} del={id => this.props.deldir(dir.name, id)} listUrl={`${this.props.dirUrl}${dir.name}/`} delUrl={this.props.dirDelUrl} edit={this.props.edit} collapse={true} dirItem={this._dirItem} key={dir.key} />
        ))
        const edit = this.state.edit ? <RePasswordInfo onclose={() => this.setState(Object.assign({}, this.state, {edit: false}))} item={{newable: true}} /> : null
        const open = this.props.itemType === PASSWORD ? (
            <li>
                <a href="#" onClick={e => killEvent(e, () => this.setState(Object.assign({}, this.state, {edit: !this.state.edit})))}>
                    New Row&nbsp;<i className="glyphicon glyphicon-plus"></i>
                </a>
            </li>
        ) : null
        return (
            <nav className="navbar-inverse" style={{width: '100%', position: 'fixed', zIndex: RIGHT_SECTION_ZINDEX}}>
                {edit}
                <div className={this.state.collapse ? 'navbar-collapse collapse' : 'navbar-collapse collapse in'}>
                    <ul className="nav navbar-nav side-nav" id="inverse-nav" style={{right: '0px', left: 'auto', overflowX: 'hidden', overflowY: 'auto'}}>
                        {open}
                        <ReDirlist name="Bookmark" time="mtime" dir={this.props.bookmark} set={this.props.bookmarkset} del={this.props.delbookmark} listUrl={this.props.bookUrl} delUrl={this.props.bookDelUrl} edit={true} collapse={false} dirItem={this._bookmarkItem} />
                        {rows}
                    </ul>
                </div>
            </nav>
        )
    }
})

export default Categorylist