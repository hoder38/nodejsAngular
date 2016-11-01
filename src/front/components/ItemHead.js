import React from 'react'
import Tooltip from './Tooltip'
import { getItemList, isValidString, api } from '../utility'

const ItemHead = React.createClass({
    _changeSort: function(name) {
        const type = (name === this.props.item.sortName && this.props.item.sortType === 'asc') ? 'desc' : 'asc'
        getItemList(name, type, this.props.set).then(() => {
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("fileSortName", name)
                localStorage.setItem("fileSortType", type)
            }
        }).catch(err => this.props.addalert(err))
    },
    _selectAll: function() {
        let select = true
        for (var i of this.props.item.list) {
            if (i.select) {
                select = false
                break
            }
        }
        this.props.select(this.props.item.list.map(item => {
            item.select = select
            return item
        }))
    },
    _addTag: function(name) {
        if (!name) {
            return Promise.reject('')
        }
        let uids = []
        this.props.item.list.forEach(item => {
            if (item.select) {
                uids.push(item.id)
            }
        })
        if (uids.length === 0) {
            return Promise.reject('Please selects item!!!')
        }
        if (isValidString(name, 'name')) {
            return api(`/api/addTag/${name}`, {uids: uids}, 'PUT')
        } else if (isValidString(name, 'url')) {
            return api('/api/addTagUrl', {
                uids: uids,
                url: name,
            }, 'PUT')
        } else {
            return Promise.reject('Please inputs new tag!!!')
        }
    },
    render: function() {
        let nameSort = null, timeSort = null, countSort = null
        if (this.props.item.sortName === 'name') {
            nameSort = (this.props.item.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        } else if (this.props.item.sortName === 'mtime') {
            timeSort = (this.props.item.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        } else {
            countSort = (this.props.item.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        }
        let selectClass1 = 'glyphicon glyphicon-ok'
        let selectClass2 = 'text-right active'
        let selectClass3 = 'glyphicon glyphicon-cog'
        let selectClass4 = 'pull-right active'
        let tooltip = null
        let addTag = null
        for (var i of this.props.item.list) {
            if (i.select) {
                selectClass1 = 'glyphicon glyphicon-remove-sign'
                selectClass2 = 'text-right'
                selectClass3 = 'glyphicon glyphicon-plus'
                selectClass4 = 'pull-right'
                tooltip = <Tooltip tip="增加共同TAG" place="top" />
                addTag = () => this.props.globalinput((exact, name) => this._addTag(name))
                break
            }
        }
        return (
            <ul className="nav nav-pills" style={{backgroundColor: 'white', borderBottom: '2px solid #ddd'}}>
                <li className={selectClass2} style={{width: '56px'}}>
                    <Tooltip tip="全選 / 取消" place="right" />
                    <a href="#" onClick={this._selectAll}>
                        <i className={selectClass1}></i>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={() => this._changeSort('name')}>
                        name&nbsp;
                        {nameSort}
                    </a>
                </li>
                <li className={selectClass4} style={{width: '50px'}}>
                    {tooltip}
                    <a href="#" onClick={addTag}>
                        <i className={selectClass3}></i>
                    </a>
                </li>
                <li className="pull-right" style={{width: '10%', minWidth: '68px'}} onClick={() => this._changeSort('count')}>
                    <a href="#" style={{padding: '10px 5px'}}>
                        count&nbsp;
                        {countSort}
                    </a>
                </li>
                <li className="pull-right" style={{width: '15%', minWidth: '68px'}} onClick={() => this._changeSort('mtime')}>
                    <a href="#" style={{padding: '10px 5px'}}>
                        time&nbsp;
                        {timeSort}
                    </a>
                </li>
            </ul>
        )
    }
})

export default ItemHead