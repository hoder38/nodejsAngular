import React from 'react'
import { WIDGET_ZINDEX, UPLOAD } from '../constants'
import WidgetButton from './WidgetButton'

export default function WidgetManage({ uploadProgress, toggle }) {
    return (
        <div className="btn-group-vertical" id="widget-manage-section" style={{float: 'right', position: 'fixed', bottom: '50px', zIndex: WIDGET_ZINDEX}}>
            <WidgetButton name="Uploader" show={true} progress={`${uploadProgress}%`} buttonType="info" onclick={() => toggle(UPLOAD)} />
        </div>
    )
}
