import { HEIGHT, initBoard, WIDTH } from '../helpers/board';

export const WEBSOCKET = {
  CONNECT: 'web-socket/connect',
  CONNECTED: 'web-socket/connected',
  CONNECTING: 'web-socket/connecting',
  CONNECT_ERROR: 'web-socket/connect_error',
  DISCONNECT: 'web-socket/disconnect',
  DISCONNECTED: 'web-socket/disconnected',
};

export const RED_TETRIS = {
  REGISTER: 'red-tetris/register',
};

export const GAME = {
  START: 'game/start',
  BOARD: 'game/board',
  CURRENT_PIECE: 'game/currentPiece',
  ACTION: 'game/action',
};

export const ROOM = {
  CREATE: 'room/create',
  JOIN: 'room/join',
  READY: 'room/ready',
};

export const DEFAULT_GAME_STATE = {
  id: null,
  player: null,
  board: initBoard(WIDTH, HEIGHT),
  score: 0,
  combo: 0,
  totalLineCleared: 0,
  level: 1,
  nextShapes: [],
};

export const INITIAL_STATE = {
  socket: null,
  rooms: [],
  currentRoom: null,
  player: null,
  roomGames: {},
  gameState: DEFAULT_GAME_STATE,
  error: null,
};
