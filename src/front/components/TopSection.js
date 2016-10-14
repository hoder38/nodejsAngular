import React from 'react'
import TopInput from './TopInput'
import TopPath from './TopPath'
import TopHead from './TopHead'

export default function TopSection() {
    return (
        <section id="top-section" style={{float: 'left', position: 'fixed', left: '0px', width: '100%'}}>
            <TopInput />
            <TopPath />
            <TopHead />
        </section>
    )
}