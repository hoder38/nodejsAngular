import React from 'react'
import Dropdown from './Dropdown'
import { api, isValidString } from '../utility'

const ItemdFile = React.createClass({
    _download: function(id) {
        if (this.props.bookmark) {
            this.props.setLatest(id)
        }
        window.location.href = `${this.props.mainUrl}/download/${id}`
    },
    _save2drive: function(id) {
        if (this.props.bookmark) {
            this.props.setLatest(id)
        }
        api(`${this.props.mainUrl}/api/download2drive/${id}`).then(result => this.props.addalert('start saving to drive')).catch(err => this.props.addalert(err))
    },
    _edit: function(id, name) {
        this.props.globalinput(new_name => isValidString(new_name, 'name') ? api(`${this.props.mainUrl}/api/editFile/${id}`, {name: new_name}, 'PUT').then(result => {
            if (result.name) {
                this.props.pushfeedback(result)
            }
        }).catch(err => this.props.addalert(err)) : this.props.addalert('name not vaild!!!'), name)
    },
    _delete: function(id, recycle) {
        api(`${this.props.mainUrl}/api/delFile/${id}/${recycle}`, null, 'DELETE').catch(err => this.props.addalert(err))
    },
    render: function() {
        let item = this.props.item
        let content = (
            <a href="#" className="item-point">
                <i className="glyphicon glyphicon-question-sign" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
            </a>
        )
        let dropList = []
        let key = 0
        if (!item.thumb && item.status !== 7 && item.status !== 8) {
            dropList.push({title: 'download', onclick: () => this._download(item.id), key: key++})
            dropList.push({title: 'download to drive', onclick: () => this._save2drive(item.id), key: key++})
        }
        if (item.isOwn) {
            if (!item.thumb) {
                dropList.push({title: 'edit', onclick: () => this._edit(item.id, item.name), key: key++})
            }
            dropList.push({title: 'delete', onclick: () => this._delete(item.id, item.recycle), key: key++})
        }
        if (item.recycle === 1 || item.recycle === 2 || item.recycle === 3 || item.recycle === 4) {
            dropList.push({title: 'recover', onclick: () => console.log(123), key: key++})
        }
        if (item.status === 3 && !item.thumb) {
            dropList.push({title: 'upload subtitle', onclick: () => console.log(123), key: key++})
            dropList.push({title: 'search subtitle', onclick: () => console.log(123), key: key++})
        }
        if (item.cid) {
            dropList.push({title: `訂閱${item.ctitle}`, onclick: () => console.log(123), key: key++})
        }
        if (item.noDb) {
            dropList.push({title: '儲存到local', onclick: () => console.log(123), key: key++})
        }
        if (item.media) {
            dropList.push({title: 'delete media', onclick: () => console.log(123), key: key++})
        }
        if (item.status === 0 || item.status === 1 || item.status === 9) {
            dropList.push({title: 'join', onclick: () => console.log(123), key: key++})
        }
        if (item.status === 9) {
            dropList.push({title: '儲存playlist', onclick: () => console.log(123), key: key++})
            dropList.push({title: 'convert', onclick: () => console.log(123), key: key++})
        }

        if (item.media) {
            let error = item.media.timeout ? 'timeout' : ''
            if (item.media.err) {
                Object.keys(item.media.err).forEach(i => error = `${error} ${i}: ${item.media.err[i]}`)
            }
            content = (
                <span>
                    {item.name}<br />
                    type: {item.media.type}<br />
                    key: {item.media.key}<br />
                    err: {error}
                </span>
            )
        } else {
            switch(item.status) {
                case 2:
                content = (
                    <a href="#" className="item-point">
                        <span style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-picture" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>
                            <img src={item.thumb ? item.thumb : `${this.props.mainUrl}/preview/${item.id}`} alt={item.name} style={{position: 'absolute', height: '42px', width: '42px', left: '0px'}} />
                        </span>
                        {item.name}
                    </a>
                )
                break
                case 3:
                content = (
                    <a href="#" className="item-point">
                        <span style={{position: 'relative'}}>
                            <i className="glyphicon glyphicon-facetime-video" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>
                            <img src={item.thumb ? item.thumb : `${this.props.mainUrl}/preview/${item.id}`} alt={item.name} style={{position: 'absolute', height: '42px', width: '42px', left: '0px'}} />
                        </span>
                        {item.name}
                    </a>
                )
                break
                case 4:
                content = (
                    <a href="#" className="item-point">
                        <i className="glyphicon glyphicon-headphones" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
                    </a>
                )
                break
                case 5:
                content = (
                    <a href="#" className="item-point">
                        <i className="glyphicon glyphicon-file" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
                    </a>
                )
                break
                case 6:
                content = (
                    <a href="#" className="item-point">
                        <i className="glyphicon glyphicon-list-alt" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
                    </a>
                )
                break
                case 7:
                content = (
                    <a href="#" className="item-point">
                        <i className="glyphicon glyphicon-bookmark" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
                    </a>
                )
                break
                case 8:
                content = (
                    <a href="#" className="item-point">
                        <i className="glyphicon glyphicon-tags" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
                    </a>
                )
                break
                case 9:
                content = (
                    <a href="#" className="item-point">
                        <i className="glyphicon glyphicon-th-list" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
                    </a>
                )
                break
            }
        }
        let fileType = item.thumb ? 'external' : ''
        if (item.noDb) {
            fileType = 'outside'
        } else {
            switch(item.recycle) {
                case 1:
                case 2:
                case 3:
                fileType = 'recycling'
                break
                case 4:
                fileType = 'recycled'
                break
            }
        }
        fileType = (this.props.latest === item.id) ? `${fileType} info` : fileType
        return (
            <tr className={fileType}>
                <td className="text-center" style={{width: '56px'}}>
                    <input
                        type="checkbox"
                        checked={item.select}
                        ref={ref => this.props.getRef(ref)}
                        onChange={this.props.onchange} />
                </td>
                <td style={{whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                    {content}
                </td>
                <td style={{width: '15%', minWidth: '68px'}}>{item.utime}</td>
                <td style={{width: '10%', minWidth: '68px'}}>{item.count}</td>
                <td style={{width: '50px'}}>
                    <Dropdown headelement="span" style={{left: 'auto', right: '0px', top: '0px'}} droplist={dropList}>
                        <button type="button" className="btn btn-default">
                            <span className="caret"></span>
                        </button>
                    </Dropdown>
                </td>
            </tr>
        )
    }
})

export default ItemdFile