import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import { socketIoEmitterMiddleware, socketIoListenerMiddleware } from './middlewares/socket-io';

import redTetrisReducer from './reducers/red-tetris';
import { WIDTH, HEIGHT, initBoard } from '../../shared/helpers/board';

const INITIAL_STATE = {
  socket: null,
  rooms: [],
  currentRoom: null,
  player: null,
  roomGames: {},
  gameState: {
    id: null,
    player: null,
    board: initBoard(WIDTH, HEIGHT),
    score: 0,
    combo: 0,
    totalLineCleared: 0,
    level: 1,
    nextShapes: [],
  },
};

const setupStore = () => configureStore({
  reducer: redTetrisReducer,
  preloadedState: INITIAL_STATE,
  middleware: [socketIoListenerMiddleware, socketIoEmitterMiddleware, createLogger()],
});

export default setupStore;
