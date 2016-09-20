import React from 'react'

export default function WidgetButton({ name, show, progress, buttonType, onclick }) {
    const button = `btn btn-${buttonType}`
    const showWidget = show ? {} : {display: 'none'}
    return (
        <button type="button" className={button} onClick={onclick} style={showWidget}>
            {name}<span className="badge">{progress}</span>
        </button>
    )
}
