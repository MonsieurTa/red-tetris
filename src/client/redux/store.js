import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { socketIoEmitterMiddleware, socketIoListenerMiddleware } from './middlewares/socket-io';

import redTetrisReducer from './reducers/red-tetris';

const INITIAL_STATE = {};

const setupStore = () => configureStore({
  reducer: redTetrisReducer,
  preloadedState: INITIAL_STATE,
  middleware: [socketIoListenerMiddleware, socketIoEmitterMiddleware, createLogger()],
});

export default setupStore;
