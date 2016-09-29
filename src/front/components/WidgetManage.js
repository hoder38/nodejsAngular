import React from 'react'
import { WIDGET_BUTTON_ZINDEX, UPLOAD, FEEDBACK } from '../constants'
import WidgetButton from './WidgetButton'

export default function WidgetManage({ uploadProgress }) {
    return (
        <div className="btn-group-vertical" id="widget-manage-section" style={{float: 'right', position: 'fixed', bottom: '50px', zIndex: WIDGET_BUTTON_ZINDEX}}>
            <WidgetButton name="Uploader" show={true} progress={`${uploadProgress}%`} buttonType="info" widget={FEEDBACK} />
        </div>
    )
}
