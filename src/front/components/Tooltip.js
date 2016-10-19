import React from 'react'
import { findDOMNode } from 'react-dom'

const Tooltip = React.createClass({
    getInitialState: function() {
        return {show: false}
    },
    componentDidMount: function() {
        this._self = findDOMNode(this)
        this._target = this._self.parentNode
        this._target.addEventListener('mouseenter', this._showTooltip)
        this._target.addEventListener('mouseleave', this._hideTooltip)
    },
    componentWillUnmount: function() {
        this._target.removeEventListener('mouseenter', this._showTooltip)
        this._target.removeEventListener('mouseleave', this._hideTooltip)
    },
    _showTooltip: function() {
        this.setState({show: true})
    },
    _hideTooltip: function() {
        this.setState({show: false})
    },
    render: function() {
        let place = 'right'
        let show = {visibility: 'hidden', whiteSpace: 'nowrap'}
        switch(this.props.place) {
            case 'top':
            place = 'top'
            if (this._target && this.state.show) {
                show = {
                    top: `${-this._self.clientHeight + this._self.offsetTop}px`,
                    left: `${Math.round((this._target.clientWidth - this._self.clientWidth) / 2) + this._self.offsetLeft}px`,
                    whiteSpace: 'nowrap',
                }
            }
            break
            default:
            if (this._target && this.state.show) {
                show = {
                    top: `${Math.round((this._target.clientHeight - this._self.clientHeight) / 2) + this._self.offsetTop}px`,
                    left: `${this._target.clientWidth + this._self.offsetLeft}px`,
                    whiteSpace: 'nowrap',
                }
            }
            break
        }
        return (
            <div className={`tooltip in ${place}`} style={show}>
                <div className="tooltip-arrow"></div>
                <div className="tooltip-inner">{this.props.tip}</div>
            </div>
        )
    }
})

export default Tooltip
