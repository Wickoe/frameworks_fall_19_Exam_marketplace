import React from 'react';
import ReactDOM from 'react-dom';

import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';

import App from './App';
import rootReducers from './Reducers';

const asyncMiddleware = require('redux-thunk').default;

const store = createStore(rootReducers, applyMiddleware(asyncMiddleware));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);