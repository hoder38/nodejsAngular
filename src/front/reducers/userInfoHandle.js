import { USER_INFO_ADD, USER_INFO_POP } from '../constants'

const initialState = []

export default function userInfoHandle (state = initialState, action) {
    switch (action.type) {
        case USER_INFO_ADD:
        if (Array.isArray(action.user)) {
            return [
                ...state,
                ...action.user,
            ]
        } else {
            let is_add = false
            let new_state = state.map(user => {
                if (user.key === action.user.key) {
                    is_add = true
                    return action.user
                } else {
                    return user
                }
            })
            if (!is_add) {
                new_state.push(action.user)
            }
            return new_state
        }
        case USER_INFO_POP:
        return state.filter(user => user.key !== action.key)
        default:
        return state
    }
}
