import React from 'react'
import UserInput from './UserInput'
import Tooltip from './Tooltip'

const ItemInput = React.createClass({
    getInitialState: function() {
        this._input = new UserInput.Input(['input1'], this._handleSubmit, this._handleChange)
        return Object.assign({
            exact: false,
        }, this._input.initValue())
    },
    componentWillUnmount: function() {
        this.props.inputclose(true)
    },
    componentDidUpdate: function() {
        if (this.props.glbIn && this.props.glbIn.input !== 0) {
            this._input.initFocus()
        }
    },
    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault()
        }
        if (!this.props.glbIn) {
            return false
        }
        this.props.glbIn.callback(this.state.exact, this.state.input1).then(() => {
            if (this.props.glbIn.input !== 0) {
                this.props.inputclose(false)
            }
        }).catch(err => this.props.addalert(err))
        this.setState(this._input.initValue())
        this._input.allBlur()
    },
    _handleChange: function() {
        this.setState(this._input.getValue())
    },
    render: function() {
        if (!this.props.glbIn) {
            return null
        }
        const exactClass1 = this.state.exact ? `btn btn-${this.props.glbIn.color}` : 'btn active btn-primary'
        const exactClass2 = this.state.exact ? 'glyphicon glyphicon-eye-open' : 'glyphicon glyphicon-eye-close'
        const close = this.props.glbIn.input === 0 ? (
            <button className={exactClass1} type="button" onClick={() => this.setState(Object.assign({}, this.state, {exact: !this.state.exact}))}>
                <i className={exactClass2}></i>
            </button>
        ) : (
            <button className={`btn btn-${this.props.glbIn.color}`} type="button" onClick={() => this.props.inputclose(false)}>
                <i className="glyphicon glyphicon-remove"></i>
            </button>
        )
        const tooltip = this.props.glbIn.input === 0 ? <Tooltip tip="嚴格比對" place="right" /> : null
        let submitClass = 'glyphicon glyphicon-search'
        switch(this.props.glbIn.input) {
            case 1:
            submitClass = 'glyphicon glyphicon-ok'
            break;
        }
        return (
            <form onSubmit={this._handleSubmit}>
                <div className="input-group">
                    <span className="input-group-btn">
                        {tooltip}
                        {close}
                    </span>
                    <UserInput
                        val={this.state.input1}
                        getinput={this._input.getInput('input1')}
                        placeholder={this.props.glbIn.value} />
                    <span className="input-group-btn">
                        <button className={`btn btn-${this.props.glbIn.color}`} type="submit">
                            <span className={submitClass}></span>
                        </button>
                    </span>
                </div>
            </form>
        )
    }
})

export default ItemInput