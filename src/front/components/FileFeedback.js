import React from 'react'
import { FEEDBACK } from '../constants'
import { isValidString, api } from '../utility'
import Tooltip from './Tooltip'
import UserInput from './UserInput'
import Dropdown from './Dropdown'

let key = 0

const FileFeedback = React.createClass({
    getInitialState: function() {
        this._input = new UserInput.Input(['url'], this._handleSubmit, this._handleChange)
        this._select = []
        return Object.assign({
            show: false,
            tags: [],
            selects: [],
            historys: [],
        }, this._input.initValue())
    },
    componentWillMount: function() {
        if (this.props.id) {
            this.setState(Object.assign({}, this.state, this._setList(this.props)))
        }
    },
    componentDidMount: function() {
        this._targetArr = Array.from(document.querySelectorAll('[data-widget]')).filter(node => node.getAttribute('data-widget') === FEEDBACK)
        if (this._targetArr.length > 0) {
            this._targetArr.forEach(target => {
                target.addEventListener('click', this._toggle)
            })
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.id !== nextProps.id) {
            this.setState(Object.assign({}, this.state, this._setList(nextProps)))
            if (!nextProps.id) {
                api(`${this.props.mainUrl}/api/feedback`).then(result => this.props.feedbackset(result.feedbacks)).catch(err => this.props.addalert(err))
            }
        }
    },
    componentWillUnmount: function() {
        if (this._targetArr.length > 0) {
            this._targetArr.forEach(target => {
                target.removeEventListener('click', this._toggle)
            })
        }
    },
    _setList: function(props) {
        return {
            tags: [
                ...props.select,
                ...props.option,
            ],
            selects: [
                ...props.select.map(tag => true),
                ...props.option.map(tag => false),
            ],
            history: [
                ...props.select.map(tag => true),
                ...props.option.map(tag => false),
            ],
        }
    },
    _toggle: function() {
        this.setState(Object.assign({}, this.state, {show: !this.state.show}))
    },
    _addTag: function(tags) {
        let ret = {}
        tags.forEach(tag => {
            if (isValidString(tag, 'name')) {
                for (let i of this.props.other) {
                    if (i === tag) {
                        return false
                    }
                }
                for (let i in this.state.tags) {
                    if (this.state.tags[i] === tag) {
                        if (this.state.selects[i]) {
                            return false
                        } else {
                            if (!ret['selects']) {
                                ret['selects'] = this.state.selects.slice()
                            }
                            ret['selects'][i] = true
                            return false
                        }
                    }
                }
                if (!ret['selects']) {
                    ret['selects'] = this.state.selects.slice()
                }
                ret['selects'].splice(0, 0, true)
                if (!ret['tags']) {
                    ret['tags'] = this.state.tags.slice()
                }
                ret['tags'].splice(0, 0, tag)
            } else {
                this.props.addalert('Feedback tag is not valid!!!')
            }
        })
        return ret
    },
    _sendTag: function() {
        const send_tag = this.state.tags.map((tag, i) => {
            if (isValidString(tag, 'name')) {
                return {
                    tag: tag,
                    select: this.state.selects[i]
                }
            }
        })
        if (isValidString(this.props.name, 'name')) {
            api(`/api/sendTag/${this.props.id}`, {
                tags: send_tag,
                name: this.props.name,
            }, 'PUT').then(result => this._history = result.history).catch(err => this.props.addalert(err))
            this.props.handlefeedback(this.props.id)
        } else {
            this.props.addalert('Feedback name is not valid!!!')
        }
    },
    _handleSelect: function() {
        this.setState(Object.assign({}, this.state, {selects: this.state.selects.map((select, i) => this._select === null ? false : this._select[i].checked)}))
    },
    _handleChange: function() {
        this.setState(Object.assign({}, this.state, this._input.getValue()))
    },
    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault()
        }
        this._input.initFocus()
        if (!isValidString(this.state.url, 'url')) {
            this.setState(Object.assign(this.state, this._input.initValue(), this._addTag([this.state.url])))
        } else {
            api('/api/addTagUrl', {url: this.state.url}, 'POST').then(result => this.setState(Object.assign(this.state, this._input.initValue(), this._addTag(result.tags)))).catch(err => this.props.addalert(err))
        }
    },
    render: function() {
        const show = (this.state.show && this.props.id) ? {} : {display: 'none'}
        let rows = []
        this.state.tags.forEach((tag, i) => {
            const history = this.state.historys[i] ? 'form-control list-group-item-danger': 'form-control'
            rows.push(
                <div className="input-group" key={key++}>
                    <span className="input-group-addon">
                        <input
                            type="checkbox"
                            checked={this.state.selects[i]}
                            ref={ref => this._select[i] = ref}
                            onChange={this._handleSelect} />
                    </span>
                    <span className={history} style={{wordBreak: 'break-all', wordWrap: 'break-word', height: 'auto'}}>{tag}</span>
                    <Dropdown headelement="span" className="input-group-btn" style={{left: 'auto', right: '0px', top: '0px'}} droplist={this.props.dirs} param={tag}>
                        <button type="button" className="btn btn-default">
                            <span className="caret"></span>
                        </button>
                    </Dropdown>
                </div>
            )
        })
        let other_rows = []
        this.props.other.forEach(tag => {
            const history = this.state.historys[i] ? 'form-control list-group-item-danger': 'form-control'
            rows.push(
                <div className="input-group" key={key++}>
                    <span className="input-group-addon">
                        <input type="checkbox" disabled="true" />
                    </span>
                    <span className={history} style={{wordBreak: 'break-all', wordWrap: 'break-word', height: 'auto'}}>{tag}</span>
                    <Dropdown headelement="span" className="input-group-btn" style={{left: 'auto', right: '0px', top: '0px'}} droplist={this.props.dirs} param={tag}>
                        <button type="button" className="btn btn-default">
                            <span className="caret"></span>
                        </button>
                    </Dropdown>
                </div>
            )
        })
        return (
            <section className="panel panel-default" style={Object.assign({maxWidth: '350px', marginBottom: '0px'}, show)}>
                <div className="panel-heading" onClick={this._toggle}>
                    <h4 className="panel-title">
                        {this.props.name}<i className="pull-right glyphicon glyphicon-remove"></i>
                    </h4>
                </div>
                <div className="panel-body" style={{overflowX: 'hidden', overflowY: 'auto', maxHeight: '70vh', padding: '0px'}}>
                    {rows}
                    {other_rows}
                </div>
                <form onSubmit={this._handleSubmit}>
                    <div className="input-group">
                        <span className="input-group-btn">
                            <Tooltip tip="儲存至後台" place="top">
                                <button type="button" className="btn btn-default" onClick={this._sendTag}>
                                    <i className="glyphicon glyphicon-ok"></i>
                                </button>
                            </Tooltip>
                        </span>
                        <UserInput
                            val={this.state.url}
                            getinput={this._input.getInput('url')}
                            placeholder="New tag..." />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="submit">
                                <i className="glyphicon glyphicon-plus"></i>
                            </button>
                        </span>
                        <span className="input-group-btn">
                            <Tooltip tip="延後整理" place="top">
                                <button className="btn btn-default" type="button" onClick={() => this.props.handlefeedback(this.props.id)}>
                                    <i className="glyphicon glyphicon-repeat"></i>
                                </button>
                            </Tooltip>
                        </span>
                    </div>
                </form>
            </section>
        )
    }
})

export default FileFeedback
