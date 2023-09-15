import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import store, {history} from './store/store';
import * as serviceWorker from './serviceWorker';

import 'semantic-ui-css/semantic.min.css';
import './css/index.css';
import './css/layout.css';
import "./css/components.css";
import './css/form.css';
import './css/public.css';
import './css/admin.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'noty/lib/noty.css';
import 'noty/lib/themes/sunset.css';
import { ConnectedRouter } from 'connected-react-router';


ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
// serviceWorker.register();
