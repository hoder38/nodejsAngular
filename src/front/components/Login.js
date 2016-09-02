import React from 'react'
import { isValidString } from '../utility'
import ReAlertlist from '../containers/ReAlertlist'
import { browserHistory } from 'react-router'
import { doLogin, handleInput } from '../utility'

const initial_state = {
    username: '',
    password: '',
}

const Login = React.createClass({
    getInitialState: function() {
        this._input = handleInput(2, ['username', 'password'], this._handleSubmit)
        return initial_state
    },
    componentDidMount: function() {
        this._loginInit()
    },
    _handleChange: function() {
        this.setState(this._input[2]())
    },
    _handleSubmit: function(e) {
        if (e) {
            e.preventDefault()
        }
        if (isValidString(this.state.username, 'name') && isValidString(this.state.password, 'passwd')) {
            doLogin(this.state.username, this.state.password)
            .then(() => {
                browserHistory.goBack()
                this._loginInit()
            }).catch(err => {
                this.props.addalert(err)
                this._loginInit()
            })
        } else {
            this.props.addalert('user name or password is not vaild!!!')
            this._loginInit()
        }
    },
    _loginInit: function() {
        this.setState(initial_state)
        if (this._input[0].ref !== null) {
            this._input[0].ref.focus()
        }
    },
    render: function() {
        return (
            <div>
                <ReAlertlist />
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="text-center">Login</h1>
                    </div>
                    <div className="modal-body">
                        <form className="form col-md-12 center-block" onSubmit={this._handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control input-lg"
                                    placeholder="Username"
                                    value={this.state.username}
                                    ref={ref => this._input[0].getRef(ref)}
                                    onChange={this._handleChange}
                                    onKeyPress={this._input[0].onenter} />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control input-lg"
                                    placeholder="Password"
                                    value={this.state.password}
                                    ref={ref => this._input[1].getRef(ref)}
                                    onChange={this._handleChange}
                                    onKeyPress={this._input[1].onenter} />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-lg btn-block">
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        )
    }
})

export default Login