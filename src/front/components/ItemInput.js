import React from 'react'
import UserInput from './UserInput'
import Tooltip from './Tooltip'
import { getItemList } from '../utility'

const ItemInput = React.createClass({
    getInitialState: function() {
        this._input = new UserInput.Input(['name'], this._handleSubmit, this._handleChange)
        return Object.assign({
            exact: false,
        }, this._input.initValue())
    },
    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault()
        }
        if (this.props.pathLength > 0 && !this.state.name) {
            return false
        }
        getItemList(this.props.sortName, this.props.sortType, this.props.set, 0, '', false, (this.state.name ? this.state.name : null), 0, this.state.exact, this.props.multi, true).catch(err => this.props.addalert(err))
        this.setState(this._input.initValue())
        this._input.allBlur()
    },
    _handleChange: function() {
        this.setState(this._input.getValue())
    },
    render: function() {
        const exactClass1 = this.state.exact ? 'btn btn-default' : 'btn active btn-primary'
        const exactClass2 = this.state.exact ? 'glyphicon glyphicon-eye-open' : 'glyphicon glyphicon-eye-close'
        return (
            <form onSubmit={this._handleSubmit}>
                <div className="input-group">
                    <span className="input-group-btn">
                        <Tooltip tip="嚴格比對" />
                        <button className={exactClass1} type="button" onClick={() => this.setState(Object.assign({}, this.state, {exact: !this.state.exact}))}>
                            <i className={exactClass2}></i>
                        </button>
                    </span>
                    <UserInput
                        val={this.state.name}
                        getinput={this._input.getInput('name')}
                        placeholder="Search Tag" />
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="submit">
                            <span className="glyphicon glyphicon-search"></span>
                        </button>
                    </span>
                </div>
            </form>
        )
    }
})

export default ItemInput