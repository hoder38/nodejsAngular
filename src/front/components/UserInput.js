import React from 'react'

export default function UserInput({ val, edit, getRef, onchange, onenter, headelement='td', topelement='tr', show=true, children }) {
    if (!show) {
        return null
    }
    const content = edit ? (
        <input
            type="text"
            className="form-control"
            value={val}
            ref={ref => getRef(ref)}
            onChange={onchange}
            onKeyPress={onenter} />
    ): val
    const [Headelement, Topelement] = [headelement, topelement]
    return (
        <Topelement>
            {children}
            <Headelement style={{wordBreak: 'break-all', wordWrap: 'break-word', height: 'auto'}}>{content}</Headelement>
        </Topelement>
    )
}