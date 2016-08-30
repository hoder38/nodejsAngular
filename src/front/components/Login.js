import React from 'react'
import { isValidString } from '../utility'
import ReAlertlist from '../containers/ReAlertlist'
import { browserHistory } from 'react-router'
import { api, doLogin } from '../utility'

const Login = React.createClass({
    getInitialState: function() {
        return {
            username: '',
            password: '',
        }
    },
    componentDidMount: function() {
        this._loginInit()
    },
    _handleChange: function() {
        this.setState({
            username: this._username.value,
            password: this._password.value,
        })
    },
    _handleEnter: function(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            this._handleFocus(this[e.target.name])
        }
    },
    _handleEnterSubmit: function(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            this._handleSubmit()
        }
    },
    _handleFocus: function(ref) {
        if (ref !== null) {
            ref.focus()
        }
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
                this.props.addalert(err.message)
                this._loginInit()
            })
        } else {
            this.props.addalert('user name or password is not vaild!!!')
            this._loginInit()
        }
    },
    _loginInit: function() {
        this.setState({
            username: '',
            password: '',
        })
        this._handleFocus(this._username)
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
                                    name="_password"
                                    className="form-control input-lg"
                                    placeholder="Username"
                                    value={this.state.username}
                                    ref={ref => this._username = ref}
                                    onChange={this._handleChange}
                                    onKeyPress={this._handleEnter}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="_password"
                                    className="form-control input-lg"
                                    placeholder="Password"
                                    value={this.state.password}
                                    ref={ref => this._password = ref}
                                    onChange={this._handleChange}
                                    onKeyPress={this._handleEnterSubmit}
                                />
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