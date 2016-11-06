import React from 'react'
import ReItemFile from '../containers/ReItemFile'
import Tooltip from './Tooltip'
import Dropdown from './Dropdown'
import { isValidString, getItemList, api, killEvent } from '../utility'

let key = 0

const Itemlist = React.createClass({
    getInitialState: function() {
        this._select = []
        this._first = -1
        this._tags = new Set()
        this._except = new Set()
        return {
            loading: false,
            allTag: false,
            relative: new Set(),
        }
    },
    componentWillMount: function() {
        if (this.props.item.list.length === 0) {
            let name = (typeof(Storage) !== "undefined" && localStorage.getItem("fileSortName")) ? localStorage.getItem("fileSortName"): this.props.item.sortName
            let type = (typeof(Storage) !== "undefined" && localStorage.getItem("fileSortType")) ? localStorage.getItem("fileSortType"): this.props.item.sortType
            this._getlist(name, type, false)
        }
    },
    _getlist: function(name=this.props.item.sortName, type=this.props.item.sortType, push=true) {
        this.setState(Object.assign({}, this.state, {loading: true}), () => getItemList(name, type, this.props.set, this.props.item.page, this.props.item.pageToken, push).then(() => this.setState(Object.assign({}, this.state, {loading: false}))).catch(err => this.props.addalert(err)))
    },
    _handleSelect: function() {
        this.props.select(this.props.item.list.map((item, i) => {
            item.select = this._select[i] === null ? false : this._select[i].checked
            return item
        }))
    },
    _handleTag: function(type, tag) {
        let uids = []
        this.props.item.list.forEach(item => {
            if (item.select) {
                uids.push(item.id)
            }
        })
        if (uids.length === 0) {
            this.props.addalert('Please selects item!!!')
        } else {
            isValidString(tag, 'name') ? api(`/api/${type}Tag/${tag}`, {uids: uids}, 'PUT').catch(err => this.props.addalert(err)) : this.props.addalert('Tag is not valid!!!!!!')
        }
    },
    _tagRow: function(tag, className) {
        return (
            <tr key={key++}>
                <td className="text-center" style={{width: '56px'}}>
                    <button type="button" className="btn btn-default" onClick={() => this.props.sendglbcf(() => this._handleTag((className === 'item-point') ? 'del' : 'add', tag), (className === 'item-point') ? `刪除此共同TAG ${tag}` : `增加此 ${tag} 為共同TAG?`)}>
                        <Tooltip tip={(className === 'item-point') ? '刪除TAG' : '增加TAG'} place="right" />
                        <i className={(className === 'item-point') ? 'glyphicon glyphicon-remove-sign' : 'glyphicon glyphicon-plus-sign'}></i>
                    </button>
                </td>
                <td style={{whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                    <a href="#" className={className} onClick={e => killEvent(e, () => getItemList(this.props.item.sortName, this.props.item.sortType, this.props.set, 0, '', false, tag, 0, true, this.props.item.multi))}>
                        <i className="glyphicon glyphicon-folder-open" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>
                        {tag}
                    </a>
                </td>
                <td style={{width: '15%', minWidth: '68px'}}></td>
                <td style={{width: '10%', minWidth: '68px'}}></td>
                <td style={{width: '50px'}}>
                    <Dropdown headelement="span" style={{left: 'auto', right: '0px', top: '0px'}} droplist={this.props.dirs} param={tag}>
                        <Tooltip tip="加到預設分類" place="left" />
                        <button type="button" className="btn btn-default">
                            <span className="caret"></span>
                        </button>
                    </Dropdown>
                </td>
            </tr>
        )
    },
    _toggleTags: function() {
        this.state.allTag ? this.setState(Object.assign({}, this.state, {
            allTag: false,
            relative: new Set(),
        })) : this.setState(Object.assign({}, this.state, {allTag: true}), () => {
            if (this.state.relative.size === 0) {
                api('/api/getOptionTag', {tags: this._tags}).then(result => this.setState(Object.assign({}, this.state, {relative: new Set(result.relative.filter(x => (!this._tags.has(x) && !this._except.has(x))))})))
            }
        })
    },
    render: function() {
        let rows = []
        let tagRows = []
        let tags = new Set()
        let exceptTags = new Set()
        let isSelect = false
        this.props.item.list.forEach((item, i) => {
            if (item.select) {
                if (this._first === -1) {
                    this._first = i
                }
                isSelect = true
                if (tags.size > 0) {
                    let newTags = new Set(item.tags.filter(x => tags.has(x)))
                    if (this.state.allTag) {
                        exceptTags = new Set([...exceptTags, ...[...tags, ...item.tags].filter(x => !newTags.has(x))])
                    }
                    tags = newTags
                } else {
                    tags = new Set(item.tags)
                }
            }
            rows.push(<ReItemFile key={item.id} item={item} getRef={ref => this._select[i] = ref} onchange={this._handleSelect} latest={this.props.item.latest} />)
        })
        if (!isSelect) {
            this._first = -1
        } else {
            if (this.state.allTag) {
                tags.forEach(tag => tagRows.push(this._tagRow(tag, 'item-point')))
                exceptTags.forEach(tag => tagRows.push(this._tagRow(tag, 'history-point')))
                this.state.relative.forEach(tag => tagRows.push(this._tagRow(tag, 'relative-point')))
            } else {
                for (let i of tags) {
                    if (tagRows.length < 3) {
                        tagRows.push(this._tagRow(i, 'item-point'))
                    } else {
                        break
                    }
                }
            }
            this._tags = tags
            this._except = exceptTags
            tagRows.push(
                <tr key={key++}>
                    <td className="text-center" style={{width: '56px'}}></td>
                    <td style={{whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                        <button type="button" className="btn btn-default" onClick={this._toggleTags}>{this.state.allTag ? 'Less' : 'All'}</button>
                    </td>
                    <td style={{width: '15%', minWidth: '68px'}}></td>
                    <td style={{width: '50px'}}></td>
                </tr>
            )
            rows.splice(this._first + 1, 0, ...tagRows)
        }
        const more = this.props.item.more ? (
            <tr>
                <td className="text-center" style={{width: '56px'}}></td>
                <td style={{whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                    <button className="btn btn-default" type="button" disabled={this.state.loading} onClick={() => this._getlist()}>More</button>
                </td>
                <td style={{width: '15%', minWidth: '68px'}}></td>
                <td style={{width: '50px'}}></td>
            </tr>
        ) : null
        return (
            <section style={{paddingTop: '125px'}}>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <tbody>
                            {rows}
                            {more}
                        </tbody>
                    </table>
                </div>
            </section>
        )
    }
})

export default Itemlist