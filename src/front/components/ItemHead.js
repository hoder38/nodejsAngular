import React from 'react'
import { getItemList } from '../utility'

const ItemHead = React.createClass({
    _changeSort: function(name) {
        const type = (name === this.props.sortName && this.props.sortType === 'asc') ? 'desc' : 'asc'
        getItemList(name, type, this.props.set).then(() => {
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("fileSortName", name)
                localStorage.setItem("fileSortType", type)
            }
        }).catch(err => this.props.addalert(err))
    },
    render: function() {
        let nameSort = null, timeSort = null, countSort = null
        if (this.props.sortName === 'name') {
            nameSort = (this.props.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        } else if (this.props.sortName === 'mtime') {
            timeSort = (this.props.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        } else {
            countSort = (this.props.sortType === 'asc') ? <i className="glyphicon glyphicon-chevron-up"></i> : <i className="glyphicon glyphicon-chevron-down"></i>
        }
        return (
            <ul className="nav nav-pills" style={{backgroundColor: 'white', borderBottom: '2px solid #ddd'}}>
                <li className="text-right active" style={{width: '56px'}}>
                    <a href="#">
                        <i className="glyphicon glyphicon-ok"></i>
                    </a>
                </li>
                <li>
                    <a href="#" onClick={() => this._changeSort('name')}>
                        name&nbsp;
                        {nameSort}
                    </a>
                </li>
                <li className="pull-right active" style={{width: '50px'}}>
                    <a href="#">
                        <i className="glyphicon glyphicon-cog"></i>
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