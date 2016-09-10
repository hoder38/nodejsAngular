import React from 'react'
import { IndexLink, browserHistory } from 'react-router'
import { ROOT_PAGE, LOGIN_PAGE, USER_PAGE } from '../constants'
import ReNavlist from '../containers/ReNavlist'
import ReToggleNav from '../containers/ReToggleNav'
import ReAlertlist from '../containers/ReAlertlist'
import Dropdown from './Dropdown'
import ReGlobalPassword from '../containers/ReGlobalPassword'
import ReGlobalComfirm from '../containers/ReGlobalComfirm'
import { collapseToggle } from '../actions'
import { api, doLogout, isValidString } from '../utility'

const App = React.createClass({
    getInitialState: function() {
        this._userDrop = [
            {title: 'Profile', className: 'glyphicon glyphicon-user', onclick: (e) => {
                e.preventDefault()
                browserHistory.push(USER_PAGE)
            }, key: 0},
            {key: 1},
            {title: 'Log Out', className: 'glyphicon glyphicon-off', onclick: (e) => {
                e.preventDefault()
                this._doLogout()
            }, key: 2},
        ]
        return {
            navlist: [
                {title: "homepage", hash: ROOT_PAGE, css: "glyphicon glyphicon-home", key: 0},
                {title: "Storage", hash: "/webpack/foo", css: "glyphicon glyphicon-hdd", key: 1},
                {title: "Password", hash: "/webpack/bar", css: "glyphicon glyphicon-lock", key: 2},
            ],
        }
    },
    componentWillMount: function() {
        api('/api/getUser')
        .then(userInfo => {
            if (isValidString(userInfo.id, 'name') && isValidString(userInfo.main_url, 'url') && isValidString(userInfo.ws_url, 'url') && isValidString(userInfo.level, 'perm')) {
                this.setState({
                    navlist: [
                        ...this.state.navlist,
                        ...userInfo.nav,
                    ],
                })
                this.props.basicset(userInfo.id, userInfo.main_url)
                if (window.MozWebSocket) {
                    window.WebSocket = window.MozWebSocket
                }
                this._ws = new WebSocket(userInfo.ws_url)
                this._level = userInfo.level
                this._ws.onopen = () => console.log(userInfo.ws_url + ": Socket has been opened!")
                this._ws.onmessage = (message) => {
                    const wsmsg = JSON.parse(message.data)
                    if (this._level >= wsmsg.level) {
                        switch (wsmsg.type) {
                            default:
                            console.log(wsmsg);
                        }
                    }
                }
            } else {
                throw Error('Invalid user data!!!')
            }
        }).catch(err => {
            this.props.addalert(err)
            this._doLogout()
        })
    },
    componentWillUnmount: function() {
        if (this._ws) {
            this._ws.close()
        }
    },
    _doLogout: function() {
        doLogout(() => this.props.basicset('guest', '')).then(() => browserHistory.push(LOGIN_PAGE)).catch(err => this.props.addalert(err))
    },
    render: function() {
        const glbPw = this.props.pwCallback.length > 0 ? <ReGlobalPassword callback={this.props.pwCallback[0]} delay={true} /> : ''
        const glbCf = this.props.cfCallback.length > 0 ? <ReGlobalComfirm callback={this.props.cfCallback[0]} text={this.props.cfCallback[1]} /> : ''
        return (
            <div id="wrapper">
                <ReAlertlist />
                {glbPw}
                {glbCf}
                <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                    <div className="navbar-header">
                        <ReToggleNav inverse={true} index={0} />
                        <IndexLink className="navbar-brand" to={ROOT_PAGE}>ANoMoPi</IndexLink>
                        <ReToggleNav inverse={false} index={1} />
                    </div>
                    <ul className="nav navbar-right top-nav">
                        <Dropdown headelement="li" droplist={this._userDrop}>
                            <a href="#">
                                <i className="glyphicon glyphicon-user"></i>&nbsp;{this.props.id}<b className="caret"></b>
                            </a>
                        </Dropdown>
                    </ul>
                    <ReNavlist navlist={this.state.navlist} />
                </nav>
                <section id="page-wrapper">{this.props.children}</section>
            </div>
        )
    }
})

export default App