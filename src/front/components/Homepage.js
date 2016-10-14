import React from 'react'
import TopInput from './TopInput'
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
        return (
            <div>
                <section id="top-section" style={{float: 'left', position: 'fixed', left: '0px', width: '100%'}}>
                    <TopInput />
                </section>
                <section style={{paddingTop: '40px'}}>{this.state.intro}</section>
            </div>
        )
    }
})

export default Homepage