import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { socketIoEmitterMiddleware, socketIoListenerMiddleware } from './middlewares/socket-io';

import redTetrisReducer from './reducers/red-tetris';

const INITIAL_STATE = {
  rooms: [],
  currentRoom: null,
  player: null,
  game: null,
  board: null,
  currentPiece: null,
  othersBoards: {},
};

const setupStore = () => configureStore({
  reducer: redTetrisReducer,
  preloadedState: INITIAL_STATE,
  middleware: [socketIoListenerMiddleware, socketIoEmitterMiddleware, createLogger()],
});

export default setupStore;
