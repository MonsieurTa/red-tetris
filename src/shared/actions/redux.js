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
    connect: () => ({ type: constants.redux.WEB_SOCKET.CONNECT }),
    connected: () => ({ type: constants.redux.WEB_SOCKET.CONNECTED }),
    connecting: () => ({ type: constants.redux.WEB_SOCKET.CONNECTING }),
    connectError: () => ({ type: constants.redux.WEB_SOCKET.CONNECT_ERROR }),
    disconnect: () => ({ type: constants.redux.WEB_SOCKET.DISCONNECT }),
    disconnected: () => ({ type: constants.redux.WEB_SOCKET.DISCONNECTED }),
  },
  RED_TETRIS: {
    register: (playerId) => ({ type: constants.redux.RED_TETRIS.REGISTER, playerId }),
  },
  ROOM: {
    created: (roomId, isHost) => ({ type: constants.redux.ROOM.CREATE, roomId, isHost }),
    joined: (roomId, username) => ({
      type: constants.redux.ROOM.JOIN, roomId, username, status: JOIN_STATUS.ADDED,
    }),
    ready: (roomId, gameId) => ({ type: constants.redux.ROOM.READY, roomId, gameId }),

    ERROR: {
      alreadyAdded: (roomId) => ({
        type: constants.redux.ROOM.JOIN, roomId, error: ERRORS.ERR_ALREADY_ADDED,
      }),
      isEmpty: (roomId) =>
        ({ type: constants.redux.ROOM.READY, roomId, error: ERRORS.ERR_IS_EMPTY }),
      wrongHost: (roomId) =>
        ({ type: constants.redux.ROOM.READY, roomId, error: ERRORS.ERR_WRONG_HOST }),
      isFull: (roomId) => ({ type: constants.redux.ROOM.JOIN, roomId, error: ERRORS.ERR_IS_FULL }),
      notFound: (roomId, type = constants.redux.ROOM.JOIN) =>
        ({ type, roomId, error: ERRORS.ERR_NOT_FOUND }),
    },
  },
  GAME: {
    start: (gameId) => ({ type: constants.redux.GAME.START, gameId }),
    board: ({ board }) => ({ type: constants.redux.GAME.BOARD, board }),
    currentPiece: (piece) => ({ type: constants.redux.GAME.CURRENT_PIECE, ...piece }),
  },
};

export default ACTIONS;
