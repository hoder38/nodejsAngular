import React from 'react'
import { IndexLink, browserHistory } from 'react-router'
import { ROOT_PAGE, LOGIN_PAGE, USER_PAGE, STORAGE_PAGE, PASSWORD_PAGE, LEFT, RIGHT, UPLOAD } from '../constants'
import { collapseToggle } from '../actions'
import { api, doLogout, isValidString } from '../utility'
import Navlist from './Navlist'
import ToggleNav from './ToggleNav'
import ReAlertlist from '../containers/ReAlertlist'
import Dropdown from './Dropdown'
import ReGlobalPassword from '../containers/ReGlobalPassword'
import ReGlobalComfirm from '../containers/ReGlobalComfirm'
import FileManage from './FileManage'
import ReWidgetManage from '../containers/ReWidgetManage'

const App = React.createClass({
    getInitialState: function() {
        this._userDrop = [
            {title: 'Profile', className: 'glyphicon glyphicon-user', onclick: () => browserHistory.push(USER_PAGE), key: 0},
            {key: 1},
            {title: 'Log Out', className: 'glyphicon glyphicon-off', onclick: () => this._doLogout(), key: 2},
        ]
        return {
            navlist: [
                {title: "homepage", hash: ROOT_PAGE, css: "glyphicon glyphicon-home", key: 0},
                {title: "Storage", hash: STORAGE_PAGE, css: "glyphicon glyphicon-hdd", key: 1},
                {title: "Password", hash: PASSWORD_PAGE, css: "glyphicon glyphicon-lock", key: 2},
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
                this.props.basicset(userInfo.id, userInfo.main_url, userInfo.isEdit)
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
                return api(`${userInfo.main_url}/api/feedback`)
            } else {
                throw Error('Invalid user data!!!')
            }
        }).then(result => {
            this.props.feedbackset(result.feedbacks)
            return api('/api/parent/list')
        }).then(result => this.props.dirsset(result.parentList.map((dir, j) => ({title: dir.show, name: dir.name, key: j, onclick: tag => this.props.sendglbcf(() => api('/api/parent/add', {name: dir.name, tag: tag}).then(result => console.log(result)).catch(err => this.props.addalert(err)), `Would you sure add ${tag} to ${dir.show}?`)})))).catch(err => {
            this.props.addalert(err)
            this._doLogout()
        })
    },
    componentWillUnmount: function() {
        if (this._ws) {
            this._ws.close()
        }
        this.props.basicset('guest', '', false)
        this.props.feedbackset([])
        this.props.userset([])
        this.props.bookmarkset([], 'name', 'asc')
        this.props.dirsset([])
    },
    _doLogout: function() {
        doLogout().then(() => browserHistory.push(LOGIN_PAGE)).catch(err => this.props.addalert(err))
    },
    render: function() {
        const glbPw = this.props.pwCallback.length > 0 ? <ReGlobalPassword callback={this.props.pwCallback[0]} delay="user" /> : ''
        const glbCf = this.props.cfCallback.length > 0 ? <ReGlobalComfirm callback={this.props.cfCallback[0]} text={this.props.cfCallback[1]} /> : ''
        return (
            <div id="wrapper" data-drop={UPLOAD}>
                <FileManage />
                <ReWidgetManage />
                <ReAlertlist />
                {glbPw}
                {glbCf}
                <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                    <div className="navbar-header">
                        <ToggleNav inverse={true} collapse={LEFT} />
                        <IndexLink className="navbar-brand" to={ROOT_PAGE}>ANoMoPi</IndexLink>
                        <ToggleNav inverse={false} collapse={RIGHT} />
                    </div>
                    <ul className="nav navbar-right top-nav">
                        <Dropdown headelement="li" droplist={this._userDrop}>
                            <a href="#">
                                <i className="glyphicon glyphicon-user"></i>&nbsp;{this.props.id}<b className="caret"></b>
                            </a>
                        </Dropdown>
                    </ul>
                    <Navlist navlist={this.state.navlist} collapse={LEFT} />
                </nav>
                <section id="page-wrapper">{this.props.children}</section>
            </div>
        )
    }
})

export default App