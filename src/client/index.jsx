import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import thunk from 'redux-thunk';

import { rootReducer } from './store';
import App from './containers/app';
import { alert } from './actions/alert';

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: [thunk, createLogger()],
});

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const root = createRoot(
  document.getElementById('tetris'),
);

root.render(<Root />);

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'));
