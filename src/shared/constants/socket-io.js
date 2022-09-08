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
  STATE: 'game:state',
  OTHERS_STATE: 'game:others:state',
  ACTION: 'game:action',
};

const ROOM = {
  CREATE: 'room:create',
  REMOVED: 'room:removed',
  JOIN: 'room:join',
  LEAVE: 'room:leave',
  READY: 'room:ready',
};

const EVENTS = {
  COMMON,
  RED_TETRIS,
  GAME,
  ROOM,
};

export default EVENTS;
