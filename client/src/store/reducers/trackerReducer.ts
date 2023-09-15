import { SET_START_LOCATION, START_TRACKING, STOP_TRACKING, TOGGLE_TRACKING_BUTTON } from './../../constants/actionTypes';
const initialState = {
    isTracking: false,
    trackingEnabled: false,
    startCoords: {},
    endCoords: {},
    startTime: "",
    endTime: ""
}

export default (state = initialState, action: any) => {
    switch(action.type){
        case START_TRACKING: // this resets values for any previous tracking sessions
            return {
                ...state,
                isTracking: true,
                startCoords: action.payload.startCoords,
                startTime: action.payload.startTime,
                endCoords: {},
            }
        case STOP_TRACKING: 
            return {
                ...state,
                isTracking: false,
            }
        case TOGGLE_TRACKING_BUTTON:
            return{
                ...state,
                trackingEnabled: action.payload
            }
        default:
            return state
    }
}