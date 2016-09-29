import React from 'react'
import { WIDGET_ZINDEX } from '../constants'
import ReFileAdd from '../containers/ReFileAdd'
import ReFileFeedback from '../containers/ReFileFeedback'

export default function FileManage() {
    return (
        <section id="file-manage-section" style={{float: 'left', position: 'fixed', bottom: '0px', zIndex: WIDGET_ZINDEX}}>
            <ReFileAdd />
            <ReFileFeedback />
        </section>
    )
}
