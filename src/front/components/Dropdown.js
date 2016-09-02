import React from 'react'
import DropdownMenu from './DropdownMenu'

const Dropdown = React.createClass({
    getInitialState: function() {
        return {
            open: false,
        }
    },
    _globalClick: function(listen) {
        if (listen) {
            document.addEventListener("click", this._closeDrop)
        } else {
            document.removeEventListener("click", this._closeDrop)
        }
    },
    _closeDrop: function() {
        this.setState({open: false})
    },
    render: function() {
        let ul = this.state.open ? <DropdownMenu droplist={this.props.droplist} globalClick={this._globalClick} /> : ''
        return (
            <this.props.headelement className={this.state.open ? 'dropdown open' : 'dropdown'} onClick={() => this.setState({open: !this.state.open})}>
                {this.props.children}
                {ul}
            </this.props.headelement>
        )
    }
})

export default Dropdown