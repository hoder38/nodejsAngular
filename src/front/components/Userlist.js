import React from 'react'
import { api } from '../utility'
import ReUserInfo from '../containers/ReUserInfo'

const Userlist = React.createClass({
    getInitialState: function() {
        return {
            new_user: [],
        }
    },
    componentWillMount: function() {
        api('/api/userinfo').then(result => {
            this.setState({
                new_user: result.user_info.filter(user => user.newable),
            })
            this.props.addUsers(result.user_info.filter(user => !user.newable))
        }).catch(err => this.props.addalert(err))
    },
    render: function() {
        let rows = []
        this.props.user_info.forEach(user => rows.push(<ReUserInfo key={user.key} user={user} />))
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