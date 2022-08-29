import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import { applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import createLogger from 'redux-logger';

import thunk from 'redux-thunk';

import { rootReducer } from './store';
import App from './containers/app';
import { alert } from './actions/alert';

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: applyMiddleware(thunk, createLogger()),
});

ReactDom.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('tetris'),
);

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'));
