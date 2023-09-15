import { ENABLE_CAMERA, DISABLE_CAMERA, TOGGLE_CAMERA } from "../../constants/actionTypes";

interface S {
    cameraEnabled: boolean
}

const initialState: S = {
    cameraEnabled: false
}

export default (state = initialState, action: any) => {
    switch(action.type){
        case TOGGLE_CAMERA:
            return {
                ...state,
                cameraEnabled: action.payload
            }
        case ENABLE_CAMERA:
            return {
                ...state,
                cameraEnabled: true
            }
        case DISABLE_CAMERA:
            return {
                ...state,
                cameraEnabled: false   
            }
        default:
            return state
    }
}