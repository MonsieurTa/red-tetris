import {
  GAME,
  RED_TETRIS,
  ROOM,
  WEBSOCKET,
} from '../constants/redux';

export const register = (username) => ({ type: RED_TETRIS.REGISTER, username });

const JOIN_STATUS = {
  ADDED: 'ADDED',
};

const ACTIONS = {
  WEBSOCKET: {
    connect: (host) => ({ type: WEBSOCKET.CONNECT, host }),
    connected: () => ({ type: WEBSOCKET.CONNECTED }),
    connecting: () => ({ type: WEBSOCKET.CONNECTING }),
    connectError: () => ({ type: WEBSOCKET.CONNECT_ERROR }),
    disconnect: () => ({ type: WEBSOCKET.DISCONNECT }),
    disconnected: () => ({ type: WEBSOCKET.DISCONNECTED }),
  },
  RED_TETRIS: {
    register: (playerId, username) =>
      ({ type: RED_TETRIS.REGISTER, playerId, username }),
  },
  ROOM: {
    created: (name, isHost) => ({ type: ROOM.CREATE, name, isHost }),
    joined: (name, username) => ({
      type: ROOM.JOIN, name, username, status: JOIN_STATUS.ADDED,
    }),
    ready: (name, gameId) => ({ type: ROOM.READY, name, gameId }),
  },
  GAME: {
    start: (gameId) => ({ type: GAME.START, gameId }),
    board: ({ board }) => ({ type: GAME.BOARD, board }),
    currentPiece: (piece) => ({ type: GAME.CURRENT_PIECE, ...piece }),
  },
};

export default ACTIONS;
