import { SHOW_MSG, RESET_MSG, SET_MENU_VISBILITY } from './../../constants/actionTypes';
import { TOGGLE_LOADING } from "../../constants/actionTypes";

const initialState = {
    loading: false,
    msgHeader: "",
    msgBody: "",
    hideMsg: true,
    menuVisible: false
}
export default (state = initialState, action: any) => {
    switch(action.type){
        case SET_MENU_VISBILITY:
            return{
                ...state,
                menuVisible: action.payload,
            }
        case TOGGLE_LOADING:
            return {
                ...state,
                loading: action.payload,
            }
        
        case SHOW_MSG:
            const {msgHeader, msgBody} = action.payload
            return {
                ...state,
                msgHeader,
                msgBody,
                hideMsg: false,
            }
        case RESET_MSG:
            return {
                ...state,
                msgHeader: "",
                msgBody: "",
                hideMsg: true,
            }
        default: 
            return state
    }
}