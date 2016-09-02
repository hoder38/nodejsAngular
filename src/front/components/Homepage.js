import React from 'react'
import { api } from '../utility'

const Homepage = React.createClass({
    getInitialState: function() {
        return {
            intro: [],
        }
    },
    componentWillMount: function() {
        let intro_msg = []
        api('/api/homepage').then(intro => {
            intro.msg.forEach((msg, i) => intro_msg.push(<span key={i}>{msg}<br /></span>))
            this.setState({
                intro: intro_msg,
            })
        }).catch(err => console.log(err))
    },
    render: function() {
        return <div>{this.state.intro}</div>
    }
})

export default Homepage