import React from 'react'
import { WIDGET_BUTTON_ZINDEX, UPLOAD, FEEDBACK, MUSIC } from '../constants'
import WidgetButton from './WidgetButton'

export default function WidgetManage({ uploadProgress, feedbackNumber }) {
    return (
        <div className="btn-group-vertical" id="widget-manage-section" style={{float: 'right', position: 'fixed', bottom: '50px', zIndex: WIDGET_BUTTON_ZINDEX}}>
            <WidgetButton name="Uploader" show={true} progress={`${uploadProgress}%`} buttonType="info" widget={UPLOAD} />
            <WidgetButton name="Feedback" show={feedbackNumber > 0 ? true : false} progress={feedbackNumber} buttonType="default" widget={FEEDBACK} />
            <WidgetButton name="Music" show={true} progress={12} buttonType="primary" widget={MUSIC} />
        </div>
    )
}
