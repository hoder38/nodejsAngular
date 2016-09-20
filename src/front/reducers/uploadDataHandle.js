import { SET_UPLOAD } from '../constants'

const initialState = {
    progress: 0,
    uploading: false,
    pushFile: () => console.log('push'),
}

export default function uploadDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_UPLOAD:
        const progress = action.progress === null ? state.progress : action.progress
        const uploading = action.uploading === null ? state.uploading : action.uploading
        const pushFile = action.pushFile === null ? state.pushFile : action.pushFile
        return Object.assign({}, state, {
            progress,
            uploading,
            pushFile,
        })
        default:
        return state
    }
}