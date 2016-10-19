import React from 'react'
import { getItemList } from '../utility'

const Itemlist = React.createClass({
    getInitialState: function() {
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
    render: function() {
        let rows = []
        this.props.item.list.forEach(item => rows.push(
            <tr key={item.id}>
                <td className="text-center" style={{width: '56px'}}>
                    <input type="checkbox" />
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
        ))
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
                            <tr>
                                <td className="text-center" style={{width: '56px'}}>
                                    <button type="button" className="btn btn-default">
                                        <i className="glyphicon glyphicon-plus-sign"></i>
                                    </button>
                                </td>
                                <td style={{whiteSpace: 'normal', wordBreak: 'break-all', wordWrap: 'break-word'}}>
                                    <a href="#" className="relative-point">
                                        <i className="glyphicon glyphicon-folder-open" style={{height: '42px', width: '42px', fontSize: '35px'}}></i>
                                        {456}
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
                            {more}
                        </tbody>
                    </table>
                </div>
            </section>
        )
    }
})

export default Itemlist