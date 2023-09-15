import {createStore, compose, applyMiddleware} from 'redux';
import rootReducer from './rootReducer';
import {routerMiddleware} from 'connected-react-router';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export default createStore(
    rootReducer(history),
    compose(
        applyMiddleware(routerMiddleware(history))
    )
);