import constants from '../constants';

export const register = (username) => ({ type: constants.redux.RED_TETRIS.REGISTER, username });

const JOIN_STATUS = {
  ADDED: 'ADDED',
};

const ERRORS = {
  ERR_ALREADY_ADDED: 'ERR_ALREADY_ADDED',
  ERR_IS_EMPTY: 'ERR_IS_EMPTY',
  ERR_IS_FULL: 'ERR_IS_FULL',
  ERR_NOT_FOUND: 'ERR_NOT_FOUND',
  ERR_WRONG_HOST: 'ERR_WRONG_HOST',
};

const ACTIONS = {
  WEBSOCKET: {
    connect: () => ({ type: constants.redux.WEBSOCKET.CONNECT }),
    connected: () => ({ type: constants.redux.WEBSOCKET.CONNECTED }),
    connecting: () => ({ type: constants.redux.WEBSOCKET.CONNECTING }),
    connectError: () => ({ type: constants.redux.WEBSOCKET.CONNECT_ERROR }),
    disconnect: () => ({ type: constants.redux.WEBSOCKET.DISCONNECT }),
    disconnected: () => ({ type: constants.redux.WEBSOCKET.DISCONNECTED }),
  },
  RED_TETRIS: {
    register: (playerId, username) =>
      ({ type: constants.redux.RED_TETRIS.REGISTER, playerId, username }),
  },
  ROOM: {
    created: (name, isHost) => ({ type: constants.redux.ROOM.CREATE, name, isHost }),
    joined: (name, username) => ({
      type: constants.redux.ROOM.JOIN, name, username, status: JOIN_STATUS.ADDED,
    }),
    ready: (name, gameId) => ({ type: constants.redux.ROOM.READY, name, gameId }),

    ERROR: {
      alreadyAdded: (name) => ({
        type: constants.redux.ROOM.JOIN, name, error: ERRORS.ERR_ALREADY_ADDED,
      }),
      isEmpty: (name) =>
        ({ type: constants.redux.ROOM.READY, name, error: ERRORS.ERR_IS_EMPTY }),
      wrongHost: (name) =>
        ({ type: constants.redux.ROOM.READY, name, error: ERRORS.ERR_WRONG_HOST }),
      isFull: (name) => ({ type: constants.redux.ROOM.JOIN, name, error: ERRORS.ERR_IS_FULL }),
      notFound: (name, type = constants.redux.ROOM.JOIN) =>
        ({ type, name, error: ERRORS.ERR_NOT_FOUND }),
    },
  },
  GAME: {
    start: (gameId) => ({ type: constants.redux.GAME.START, gameId }),
    board: ({ board }) => ({ type: constants.redux.GAME.BOARD, board }),
    currentPiece: (piece) => ({ type: constants.redux.GAME.CURRENT_PIECE, ...piece }),
  },
};

export default ACTIONS;
