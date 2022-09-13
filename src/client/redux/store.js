import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { INITIAL_STATE } from '../../shared/constants/redux';

import { socketIoEmitterMiddleware, socketIoListenerMiddleware } from './middlewares/socket-io';

import redTetrisReducer from './reducers/red-tetris';

const getMiddlewares = () => {
  const middlewares = [socketIoListenerMiddleware, socketIoEmitterMiddleware];

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger());
  }

  return middlewares;
};

const setupStore = () => configureStore({
  reducer: redTetrisReducer,
  preloadedState: INITIAL_STATE,
  middleware: getMiddlewares(),
});

export default setupStore;
