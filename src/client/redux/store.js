import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { socketIoEmitterMiddleware, socketIoListenerMiddleware } from './middlewares/socket-io';

import redTetrisReducer from './reducers/red-tetris';
import { WIDTH, HEIGHT, initBoard } from '../../shared/helpers/board';

const INITIAL_STATE = {
  rooms: [],
  createdRoom: null,
  currentRoom: null,
  player: null,
  game: null,
  board: initBoard(WIDTH, HEIGHT),
  currentPiece: null,
  roomGames: {},
};

const setupStore = () => configureStore({
  reducer: redTetrisReducer,
  preloadedState: INITIAL_STATE,
  middleware: [socketIoListenerMiddleware, socketIoEmitterMiddleware, createLogger()],
});

export default setupStore;
