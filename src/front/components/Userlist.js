import React from 'react'
import { api } from '../utility'
import ReUserInfo from '../containers/ReUserInfo'

const Userlist = React.createClass({
    getInitialState: function() {
        return {
            new_user: [],
            user_info: [],
        }
    },
    componentWillMount: function() {
        api('/api/userinfo').then(result => {
            this.setState({
                user_info: result.user_info,
            })
        }).catch(err => this.props.addalert(err))
    },
    _pushUser: function(user) {
        let is_add = false
        let new_user_info = this.state.user_info.map(orig => {
            if (orig.key === user.key) {
                is_add = true
                return user
            } else {
                return orig
            }
        })
        if (!is_add) {
            new_user_info.push(user)
        }
        this.setState(Object.assign({}, this.state, {user_info: new_user_info}))
    },
    _popUser: function(key) {
        this.setState(Object.assign({}, this.state, {user_info: this.state.user_info.filter(user => user.key !== key)}))
    },
    render: function() {
        let rows = []
        this.state.user_info.forEach(user => rows.push(<ReUserInfo key={user.key} user={user} editUser={this._pushUser} delUser={this._popUser} />))
        return (
            <div className="container" style={{width: 'auto'}}>
                <div className="well col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="row user-infos">
                        {rows}
                    </div>
                </div>
            </div>
        )
    }
})

export default Userlist