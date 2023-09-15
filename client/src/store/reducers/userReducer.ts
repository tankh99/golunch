import { SET_USER, CLEAR_USER } from "../../constants/actionTypes";
import User from '../../models/User';

interface S {
    user?: User
}

const initialState: S = {
    user: undefined
}

export default (state = initialState, action: any) => {
    switch(action.type){
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            }
        case CLEAR_USER:
            return {
                ...state,
                user: undefined,
            }
        default:
            return state
    }
}