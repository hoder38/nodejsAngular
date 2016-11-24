import React from 'react'
import UserInput from './UserInput'
import FileUploader from './FileUploader'
import Tooltip from './Tooltip'
import { killEvent } from '../utility'

const ItemInput = React.createClass({
    getInitialState: function() {
        this._input = new UserInput.Input(['input1', 'input2'], this._handleSubmit, this._handleChange)
        return Object.assign({
            exact: false,
            lang: 'ch',
            progress: 0,
        }, this._input.initValue())
    },
    componentWillUnmount: function() {
        this.props.inputclose(true)
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.index !== this.props.index) {
            this.setState(this._input.initValue({input1: nextProps.value}))
        }
    },
    componentDidUpdate: function(prevProps) {
        if (this.props.input !== 0 && prevProps.index !== this.props.index) {
            this._input.initFocus()
        }
    },
    _handleSubmit: function() {
        if (this.props.index === -1) {
            return false
        }
        this.props.callback(this.state.input1, this.state.exact, this.state.input2).then(() => {
            if (this.props.input !== 0) {
                this.props.inputclose(false)
            }
        }).catch(err => this.props.addalert(err))
        this.setState(this._input.initValue())
        this._input.allBlur()
    },
    _handleChange: function() {
        this.setState(Object.assign({}, this.state, this._input.getValue()))
    },
    _handleSelect: function(e) {
        this.setState(Object.assign({}, this.state, {lang: e.target.value}))
    },
    _setUpload: function(progress) {
        this.setState(Object.assign({}, this.state, {progress}))
    },
    render: function() {
        if (this.props.index === -1) {
            return null
        }
        const exactClass1 = this.state.exact ? `btn btn-${this.props.color}` : 'btn active btn-primary'
        const exactClass2 = this.state.exact ? 'glyphicon glyphicon-eye-open' : 'glyphicon glyphicon-eye-close'
        const close = this.props.input === 0 ? (
            <button className={exactClass1} type="button" onClick={() => this.setState(Object.assign({}, this.state, {exact: !this.state.exact}))}>
                <i className={exactClass2}></i>
            </button>
        ) : (
            <button className={`btn btn-${this.props.color}`} type="button" onClick={() => this.props.inputclose(false)}>
                <i className="glyphicon glyphicon-remove"></i>
            </button>
        )
        const tooltip = this.props.input === 0 ? <Tooltip tip="嚴格比對" place="right" /> : null
        let input = <UserInput
            val={this.state.input1}
            getinput={this._input.getInput('input1')}
            placeholder={this.props.placeholder} />
        let input2 = null
        let fromClass = 'input-group'
        let submit = (
            <button className={`btn btn-${this.props.color}`} type="submit">
                <span className="glyphicon glyphicon-search"></span>
            </button>
        )
        switch(this.props.input) {
            case 3:
            fromClass = 'input-group double-input'
            input = (
                <div className="form-control">
                    {`${this.state.progress}% Complete`}
                </div>
            )
            input2 = (
                <select className="form-control" onChange={this._handleSelect} value={this.state.lang} style={{position: 'relative'}}>
                    <option value="ch" key={0}>中文</option>
                    <option value="en" key={1}>English</option>
                </select>
            )
            submit = (
                <div className={`btn btn-${this.props.color} btn-file`}>
                    <span className="glyphicon glyphicon-folder-open"></span>&nbsp;Choose
                    <FileUploader url={this.props.placeholder} setUpload={this._setUpload} callback={(ret, e) => e ? this.props.addalert(e) : this._handleSubmit(ret)} params={{lang: this.state.lang}} />
                </div>
            )
            break
            case 2:
            input2 = <UserInput
                val={this.state.input2}
                getinput={this._input.getInput('input2')}
                placeholder={this.props.placeholder2} />
            fromClass = 'input-group double-input'
            case 1:
            submit = (
                <button className={`btn btn-${this.props.color}`} type="submit">
                    <span className="glyphicon glyphicon-ok"></span>
                </button>
            )
            break
        }
        return (
            <form onSubmit={e => killEvent(e, this._handleSubmit)}>
                <div className={fromClass}>
                    <span className="input-group-btn">
                        {tooltip}
                        {close}
                    </span>
                    {input}
                    {input2}
                    <span className="input-group-btn">
                        {submit}
                    </span>
                </div>
            </form>
        )
    }
})

export default ItemInput