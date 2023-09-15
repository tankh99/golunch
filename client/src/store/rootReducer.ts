
import {combineReducers} from 'redux';
import serviceReducer from './reducers/serviceReducer';
import userReducer from './reducers/userReducer';
import shopReducer from './reducers/shopReducer';
import trackerReducer from './reducers/trackerReducer';
import {connectRouter} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import displayReducer from './reducers/displayReducer';
import authReducer from './reducers/authReducer';

interface AppState{

}

export default (history: any) => combineReducers<AppState>({
    router: connectRouter(history),
    auth: authReducer,
    services: serviceReducer,
    users: userReducer,
    shops: shopReducer,
    tracker: trackerReducer,
    display: displayReducer,
    
})