import React from 'react'

export default function ToggleNav({ inverse, onclick }) {
    return (
        <button type="button" className="navbar-toggle" style={inverse ? {float: 'left'} : {}} onClick={onclick}>
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
        </button>
    )
}

