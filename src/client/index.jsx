import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import { socketIoListenerMiddleware, socketIoEmitterMiddleware } from './redux/middlewares/socket-io';
import { rootReducer } from './redux/store';
import socketActions from './redux/actions/socket-io';

import App from './containers/app';
import { alert } from './actions/alert';

import { HOST, PORT } from '../../params';

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
  middleware: [socketIoListenerMiddleware, socketIoEmitterMiddleware, thunk, createLogger()],
});

const Root = () => {
  useEffect(() => {
    store.dispatch(socketActions.connect(`http://${HOST}:${PORT}`));
    return () => {
      store.dispatch(socketActions.disconnect());
    };
  }, []);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const root = createRoot(
  document.getElementById('tetris'),
);

root.render(<Root />);

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'));