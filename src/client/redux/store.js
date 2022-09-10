import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { INITIAL_STATE } from '../../shared/constants/redux';

import { socketIoEmitterMiddleware, socketIoListenerMiddleware } from './middlewares/socket-io';

import redTetrisReducer from './reducers/red-tetris';

const setupStore = () => configureStore({
  reducer: redTetrisReducer,
  preloadedState: INITIAL_STATE,
  middleware: [socketIoListenerMiddleware, socketIoEmitterMiddleware, createLogger()],
});

export default setupStore;
