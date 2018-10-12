import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase';
import {createStore,  compose, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import authReducers from './store/reducers/auth';
import reportReducers from './store/reducers/reports';
import App from './App';
import './index.css';

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyBHhUSlFpKkNDfJ4TRFhp9XzGsgd1WEpj0",
    authDomain: "crime-reporter-app-d0c94.firebaseapp.com",
    databaseURL: "https://crime-reporter-app-d0c94.firebaseio.com",
    projectId: "crime-reporter-app-d0c94",
    storageBucket: "crime-reporter-app-d0c94.appspot.com",
    messagingSenderId: "1020973732708"
  };
initializeApp(config);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  auth : authReducers,
  reports : reportReducers
})

const store = createStore( reducers, composeEnhancers() );

const app = (
  <Provider store = {store}>
    <App />
  </Provider>
) 

ReactDOM.render(app, document.getElementById('root'));
