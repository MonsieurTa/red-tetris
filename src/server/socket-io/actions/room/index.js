const GAME_STATUS = {
  STARTED: 'STARTED',
};

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

const roomActions = {
  create: {
    ok: (gameId, isHost) => ({ type: 'room/create', gameId, isHost }),
  },
  join: {
    added: (gameId, playerName) => ({
      type: 'room/join', gameId, playerName, status: JOIN_STATUS.ADDED,
    }),
  },
  start: {
    started: (gameId) => ({ type: 'game/start', gameId, status: GAME_STATUS.STARTED }),
    alreadyStarted: (gameId) => ({ type: 'game/start', gameId, status: GAME_STATUS.ALREADY_STARTED }),
  },
  error: {
    alreadyAdded: (gameId, playerName) => ({
      type: 'room/join', gameId, playerName, error: ERRORS.ERR_ALREADY_ADDED,
    }),
    isEmpty: (gameId) => ({ type: 'game/start', gameId, error: ERRORS.ERR_IS_EMPTY }),
    isFull: (gameId) => ({ type: 'room/join', gameId, error: ERRORS.ERR_IS_FULL }),
    notFound: (gameId) => ({ type: 'room/join', gameId, error: ERRORS.ERR_NOT_FOUND }),
    wrongHost: (gameId) => ({ type: 'game/start', gameId, error: ERRORS.ERR_WRONG_HOST }),
  },
};

export default roomActions;
