const COMMON = {
  CONNECT: 'connect',
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  CONNECT_ERROR: 'connect_error',
  DISCONNECT: 'disconnect',
  DISCONNECTED: 'disconnected',
};

const RED_TETRIS = {
  REGISTER: 'red-tetris:register',
  ROOMS: 'red-tetris:rooms',
};

const GAME = {
  READY: 'game:ready',
  START: 'game:start',
  BOARD: 'game:board',
  CURRENT_PIECE: 'game:currentPiece',
  ACTION: 'game:action',
};

const ROOM = {
  CREATE: 'room:create',
  JOIN: 'room:join',
  READY: 'room:ready',
};

const EVENTS = {
  COMMON,
  RED_TETRIS,
  GAME,
  ROOM,
};

export default EVENTS;
