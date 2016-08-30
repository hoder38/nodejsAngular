import React from 'react'
import { IndexLink, browserHistory } from 'react-router'
import ReNavlist from '../containers/ReNavlist'
import ReToggleNav from '../containers/ReToggleNav'
import ReAlertlist from '../containers/ReAlertlist'
import Dropdown from './Dropdown'
import { collapseToggle } from '../actions'
import { api, doLogout, isValidString } from '../utility'

const App = React.createClass({
    getInitialState: function() {
        return {
            id: 'guest',
            navlist: [
                {title: "homepage", hash: "/webpack", css: "glyphicon glyphicon-home", key: 0},
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
                    id: userInfo.id,
                    navlist: [
                        ...this.state.navlist,
                        ...userInfo.nav,
                    ],
                })
                this.props.mainurlset(userInfo.main_url)
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
            this.props.addalert(err.message)
            this._doLogout()
        })
        this._userDrop = [
            {title: 'Profile', className: 'glyphicon glyphicon-user', onclick: (e) => {
                e.preventDefault()
                browserHistory.push('/webpack/foo')
            }, key: 0},
            {key: 1},
            {title: 'Log Out', className: 'glyphicon glyphicon-off', onclick: (e) => {
                e.preventDefault()
                this._doLogout()
            }, key: 2},
        ]
    },
    componentWillUnmount: function() {
        this._ws.close()
    },
    _doLogout: function() {
        doLogout().then(() => browserHistory.push('/webpack/login')).catch(err => this.props.addalert(err.message))
    },
    render: function() {
        return (
            <div id="wrapper">
                <ReAlertlist />
                <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                    <div className="navbar-header">
                        <ReToggleNav inverse={true} index={0} />
                        <IndexLink className="navbar-brand" to="/webpack">ANoMoPi</IndexLink>
                        <ReToggleNav inverse={false} index={1} />
                    </div>
                    <ul className="nav navbar-right top-nav">
                        <Dropdown headelement="li" droplist={this._userDrop}>
                            <a href="#">
                                <i className="glyphicon glyphicon-user"></i>&nbsp;{this.state.id}<b className="caret"></b>
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