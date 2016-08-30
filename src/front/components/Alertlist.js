import React from 'react'
import AlertMsg from './AlertMsg'

export default function Alertlist({ alertlist, onclose }) {
    let rows = []
    alertlist.forEach(alert => {
        rows.push(<AlertMsg key={alert.key} msg={alert.msg} onclose={() => onclose(alert.key)} />)
    })
    return <div id="alert-section">{rows}</div>
}