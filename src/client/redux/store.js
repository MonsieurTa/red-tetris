import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { socketIoEmitterMiddleware, socketIoListenerMiddleware } from './middlewares/socket-io';

import redTetrisReducer from './reducers/red-tetris';
import roomReducer from './reducers/room';
import gameReducer from './reducers/game';

// Create the root reducer separately so we can extract the RootState type
export const rootReducer = combineReducers({
  redTetris: redTetrisReducer,
  room: roomReducer,
  game: gameReducer,
});

const INITIAL_STATE = {};

const setupStore = () => configureStore({
  reducer: rootReducer,
  preloadedState: INITIAL_STATE,
  middleware: [socketIoListenerMiddleware, socketIoEmitterMiddleware, thunk, createLogger()],
});

export default setupStore;
