import React from 'react'
import { getItemList } from '../utility'

let key = 0

const Itemlist = React.createClass({
    getInitialState: function() {
        this._select = []
        return {
            loading: false,
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
        this.setState({loading: true}, () => getItemList(name, type, this.props.set, this.props.item.page, this.props.item.pageToken, push).then(() => this.setState({loading: false})).catch(err => this.props.addalert(err)))
    },
    _handleSelect: function() {
        this.props.select(this.props.item.list.map((item, i) => {
            item.select = this._select[i] === null ? false : this._select[i].checked
            return item
        }))
    },
    _tagRow: function(tag, className) {
        return (
            <tr key={key++}>
                <td className="text-center" style={{width: '56px'}}>
                    <button type="button" className="btn btn-default">
                        <i className="glyphicon glyphicon-plus-sign"></i>
                    </button>
                </td>
                <td style={{whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                    <a href="#" className={className}>
                        <i className="glyphicon glyphicon-folder-open" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>
                        {tag}
                    </a>
                </td>
                <td style={{width: '15%', minWidth: '68px'}}></td>
                <td style={{width: '10%', minWidth: '68px'}}></td>
                <td style={{width: '50px'}}>
                    <button type="button" className="btn btn-default">
                        <span className="caret"></span>
                    </button>
                </td>
            </tr>
        )
    },
    render: function() {
        let rows = []
        let firstSelect = -1
        let tags = new Set()
        let exceptTags = new Set()
        let tagRows = []
        this.props.item.list.forEach((item, i) => {
            if (item.select) {
                if (firstSelect === -1) {
                    firstSelect = i
                }
                if (tags.size > 0) {
                    let newTags = new Set(item.tags.filter(x => tags.has(x)))
                    exceptTags = new Set([...exceptTags, ...[...tags, ...item.tags].filter(x => !newTags.has(x))])
                    tags = newTags
                } else {
                    tags = new Set(item.tags)
                }
            }
            rows.push(
                <tr key={item.id}>
                    <td className="text-center" style={{width: '56px'}}>
                        <input
                            type="checkbox"
                            checked={item.select}
                            ref={ref => this._select[i] = ref}
                            onChange={this._handleSelect} />
                    </td>
                    <td style={{whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                        <a href="#" className="item-point">
                            <i className="glyphicon glyphicon-question-sign" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>{item.name}
                        </a>
                    </td>
                    <td style={{width: '15%', minWidth: '68px'}}>{item.utime}</td>
                    <td style={{width: '10%', minWidth: '68px'}}>{item.count}</td>
                    <td style={{width: '50px'}}>
                        <button type="button" className="btn btn-default">
                            <span className="caret"></span>
                        </button>
                    </td>
                </tr>
            )
        })
        tags.forEach(tag => tagRows.push(this._tagRow(tag, 'item-point')))
        exceptTags.forEach(tag => tagRows.push(this._tagRow(tag, 'history-point')))
        if (firstSelect !== -1 && firstSelect !== 0) {
            firstSelect+=2
        }
        rows.splice(firstSelect, 0, ...tagRows)
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