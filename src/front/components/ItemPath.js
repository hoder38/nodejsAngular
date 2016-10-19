import React from 'react'
import Tooltip from './Tooltip'
import Dropdown from './Dropdown'
import { getItemList, resetItemList, isValidString, api } from '../utility'

let key = 0

const ItemPath = React.createClass({
    _resetPath: function() {
        resetItemList(this.props.sortName, this.props.sortType, this.props.set).catch(err => this.props.addalert(err))
    },
    _gotoPath: function(name, index, exact) {
        getItemList(this.props.sortName, this.props.sortType, this.props.set, 0, '', false, name, index, exact).catch(err => this.props.addalert(err))
    },
    _addBookmark: function(name) {
        if (this.props.current.length === 0) {
            this.props.addalert('Empty parent list!!!')
        } else {
            if (!isValidString(name, 'name')) {
                this.props.addalert('Bookmark name is not valid!!!')
            } else {
                api('/api/bookmark/add', {name: name}).then(result => {
                    if (result.id) {
                        this.props.pushbookmark({id: result.id, name: result.name})
                    }
                    if (result.bid) {
                        result.id = result.bid
                        result.name = result.bname
                        if (result.name) {
                            this.props.pushfeedback(result)
                        }
                    }
                }).catch(err => this.props.addalert(err))
            }
        }
    },
    render: function() {
        let bookmarkList = [
            {
                title: 'new...',
                onclick: () => console.log('new bookmark'),
                key: 0,
            },
            {key: 1},
        ]
        this.props.bookmark.forEach(item => bookmarkList.push({
            title: item.name,
            onclick: () => this._addBookmark(item.name),
            key: item.id,
        }))
        let curRow = []
        this.props.current.forEach((item, i) => {
            const exactClass = this.props.exact[i] ? 'glyphicon glyphicon-eye-open' : 'glyphicon glyphicon-eye-close'
            curRow.push(
                <li key={key++}>
                    <a href="#" onClick={() => this._gotoPath(item, i + 1, this.props.exact[i])}>
                        <i className={exactClass}></i>&nbsp;{item}
                    </a>
                </li>
            )
        })
        let hisRow = []
        this.props.history.forEach((item, i) => {
            const exactClass = this.props.exact[this.props.current.length + i] ? 'glyphicon glyphicon-eye-open' : 'glyphicon glyphicon-eye-close'
            hisRow.push(
                <li className="active" key={key++}>
                    <a href="#" className="history-point" onClick={() => this._gotoPath(item, this.props.current.length + i + 1, this.props.exact[this.props.current.length + i])}>
                        <i className={exactClass}></i>&nbsp;{item}
                    </a>
                </li>
            )
        })
        const save = (this.props.current.length > 0) ? (
            <li className="active">
                <Dropdown headelement="span" droplist={bookmarkList} style={{ maxHeight: '50vh', overflowY: 'auto'}}>
                    <a href="#" className="item-point">
                        <i className="glyphicon glyphicon-floppy-disk"></i>&nbsp;SAVE
                    </a>
                </Dropdown>
            </li>
        ) : null
        return (
            <ol className="breadcrumb" style={{marginBottom: '0px', display: 'block', height: '56px'}}>
                <li>
                    <Tooltip tip="多重搜尋" />
                    <input
                        type="checkbox"
                        checked={this.props.multi}
                        ref={ref => this._multi = ref}
                        onChange={() => this.props.multiToggle(!this.props.multi)} />
                </li>
                <li>
                    <a href="#" onClick={this._resetPath}>
                        <i className="glyphicon glyphicon-home"></i>
                    </a>
                </li>
                {curRow}
                {hisRow}
                {save}
            </ol>
        )
    }
})

export default ItemPath