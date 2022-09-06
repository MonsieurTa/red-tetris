const WEBSOCKET = {
  CONNECT: 'web-socket/connect',
  CONNECTED: 'web-socket/connected',
  CONNECTING: 'web-socket/connecting',
  CONNECT_ERROR: 'web-socket/connect_error',
  DISCONNECT: 'web-socket/disconnect',
  DISCONNECTED: 'web-socket/disconnected',
};

const RED_TETRIS = {
  REGISTER: 'red-tetris/register',
};

const GAME = {
  START: 'game/start',
  BOARD: 'game/board',
  CURRENT_PIECE: 'game/currentPiece',
  ACTION: 'game/action',
};

const ROOM = {
  CREATE: 'room/create',
  JOIN: 'room/join',
  READY: 'room/ready',
};

export default {
  WEBSOCKET,
  RED_TETRIS,
  GAME,
  ROOM,
};
