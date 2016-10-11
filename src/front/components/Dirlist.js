import React from 'react'
import { api } from '../utility'

const Dirlist = React.createClass({
    getInitialState: function() {
        return {
            collapse: this.props.collapse,
            edit: false,
            loading: false,
            more: this.props.more,
        }
    },
    componentWillMount: function() {
        if (!this.props.more && this.props.dir.list.length === 0) {
            this._getlist(this.props.dir.sortName, this.props.dir.sortType)
        }
    },
    _changeSort: function(name) {
        this.setState(Object.assign({}, this.state, {
            more: this.props.more,
        }), () => {
            if (name === this.props.dir.sortName) {
                (this.props.dir.sortType === 'asc') ? this._getlist(name, 'desc') : this._getlist(name, 'asc')
            } else {
                this._getlist(name, 'asc')
            }
        })
    },
    _getlist: function(name, type, push=false) {
        this.setState(Object.assign({}, this.state, {loading: true}), () => api(`${this.props.listUrl}${name}/${type}/${this.props.dir.page}`).then(result => {
            let more = this.state.more
            let list = result.bookmarkList ? result.bookmarkList : result.taglist
            if (this.props.more) {
                if (list.length > 0) {
                    push ? this.props.set(list) : this.props.set(list, name, type)
                } else {
                    more = false
                }
            } else {
                push ? this.props.set(list) : this.props.set(list, name, type)
            }
            this.setState(Object.assign({}, this.state, {
                loading: false,
                more: more,
            }))
        }).catch(err => this.props.addalert(err)))
    },
    _delItem: function(id, name) {
        this.props.sendglbcf(() => api(`${this.props.delUrl}${id}`, null, 'DELETE').then(result => this.props.del(result.id)).catch(err => this.props.addalert(err)), `Would you sure to delete ${name} from ${this.props.name}?`)
    },
    _openList: function() {
        if (this.props.more && this.props.dir.list.length === 0) {
            this.setState(Object.assign({}, this.state, {collapse: !this.state.collapse}), () => this._getlist(this.props.dir.sortName, this.props.dir.sortType))
        } else {
            this.setState(Object.assign({}, this.state, {collapse: !this.state.collapse}))
        }
    },
    render: function() {
        let rows = []
        this.props.dir.list.forEach(item => this.state.edit ? rows.push(
            <li key={item.id}>
                <a href="#" onClick={() => this._delItem(item.id, item.name)}>
                    <i className="glyphicon glyphicon-remove"></i>{item.name}
                </a>
            </li>
        ) : rows.push(
            <li key={item.id}>
                <a href="#">{item.name}</a>
            </li>
        ))
        let nameSort = null, timeSort = null
        if (this.props.dir.sortName === 'name') {
            nameSort = (this.props.dir.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        } else {
            timeSort = (this.props.dir.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        }
        const edit = this.props.edit ? (
            <li className={this.state.edit ? 'active' : ''} onClick={() => this.setState(Object.assign({}, this.state, {edit: !this.state.edit}))}>
                <a style={{padding: '10px 15px'}} href="#">edit</a>
            </li>
        ) : null
        const more = this.state.more ? (
            <li>
                <a>
                    <button className="btn btn-default btn-xs" type="button" disabled={this.state.loading} onClick={() => this._getlist(this.props.dir.sortName, this.props.dir.sortType, true)}>More</button>
                </a>
            </li>
        ) : null
        return (
            <li className={this.state.collapse ? '' : 'active'}>
                <a href="#" onClick={this._openList}>
                    {this.props.name}&nbsp;<i className={this.state.collapse ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down'}></i>
                </a>
                <ul className={this.state.collapse ? 'nav nav-pills collapse' : 'nav nav-pills collapse in'}>
                    <li>
                        <a style={{padding: '10px 15px'}} href="#" onClick={() => this._changeSort('name')}>
                            name&nbsp;{nameSort}
                        </a>
                    </li>
                    <li>
                        <a style={{padding: '10px 15px'}} href="#" onClick={() => this._changeSort('mtime')}>
                            {this.props.time}&nbsp;{timeSort}
                        </a>
                    </li>
                    {edit}
                </ul>
                <ul className={this.state.collapse ? 'collapse' : 'collapse in'}>
                    {rows}
                    {more}
                </ul>
            </li>
        )
    }
})

export default Dirlist
