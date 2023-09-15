import { LOGIN, LOGOUT } from "../../constants/actionTypes";

const initialState = {
    loggedIn: false
}

export default (state = initialState, action: any) => {
    switch(action.type){
        case LOGIN: 
            return{
                ...state,
                loggedIn: true
            }
        case LOGOUT:
            return {
                ...state,
                loggedIn: false
            }
        default:
            return state
    }
}