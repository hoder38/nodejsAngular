import { SET_FEEDBACK, FEEDBACK_POP, FEEDBACK_PUSH } from '../constants'

const initialState = []

export default function feedbackDataHandle (state = initialState, action) {
    switch (action.type) {
        case SET_FEEDBACK:
        return action.feedback
        case FEEDBACK_PUSH:
        let is_add = false
        let new_feedbacks = state.map(feedback => {
            if (feedback.id === action.feedback.id) {
                is_add = true
                return action.feedback
            } else {
                return feedback
            }
        })
        if (!is_add) {
            new_feedbacks.push(action.feedback)
        }
        return new_feedbacks
        case FEEDBACK_POP:
        return state.filter(feedback => feedback.id !== action.id)
        default:
        return state
    }
}
