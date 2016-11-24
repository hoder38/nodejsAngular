import React from 'react'
import { WIDGET_BUTTON_ZINDEX, UPLOAD, FEEDBACK, MUSIC, VIDEO } from '../constants'
import WidgetButton from './WidgetButton'

export default function WidgetManage({ uploadProgress, feedbackNumber, musicNumber, musicMore, videoNumber, videoMore }) {
    return (
        <div className="btn-group-vertical" id="widget-manage-section" style={{float: 'right', position: 'fixed', bottom: '50px', zIndex: WIDGET_BUTTON_ZINDEX}}>
            <WidgetButton name="Uploader" show={true} progress={`${uploadProgress}%`} buttonType="info" widget={UPLOAD} />
            <WidgetButton name="Feedback" show={feedbackNumber > 0 ? true : false} progress={feedbackNumber} buttonType="default" widget={FEEDBACK} />
            <WidgetButton name="Video" show={videoNumber > 0 ? true : false} progress={videoNumber} buttonType="success" widget={VIDEO} more={videoMore} />
            <WidgetButton name="Music" show={musicNumber > 0 ? true : false} progress={musicNumber} buttonType="primary" widget={MUSIC} more={musicMore} />
        </div>
    )
}
