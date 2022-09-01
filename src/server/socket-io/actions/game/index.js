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

const gameActions = {
  create: {
    ok: (gameId, isHost) => ({ type: 'game/create', gameId, isHost }),
  },
  join: {
    added: (gameId, playerName) => ({
      type: 'game/join', gameId, playerName, status: JOIN_STATUS.ADDED,
    }),
  },
  start: {
    started: (gameId) => ({ type: 'game/start', gameId, status: GAME_STATUS.STARTED }),
    alreadyStarted: (gameId) => ({ type: 'game/start', gameId, status: GAME_STATUS.ALREADY_STARTED }),
  },
  error: {
    alreadyAdded: (gameId, playerName) => ({
      type: 'game/join', gameId, playerName, error: ERRORS.ERR_ALREADY_ADDED,
    }),
    isEmpty: (gameId) => ({ type: 'game/start', gameId, error: ERRORS.ERR_IS_EMPTY }),
    isFull: (gameId) => ({ type: 'game/join', gameId, error: ERRORS.ERR_IS_FULL }),
    notFound: (gameId) => ({ type: 'game/join', gameId, error: ERRORS.ERR_NOT_FOUND }),
    wrongHost: (gameId) => ({ type: 'game/start', gameId, error: ERRORS.ERR_WRONG_HOST }),
  },
};

export default gameActions;
