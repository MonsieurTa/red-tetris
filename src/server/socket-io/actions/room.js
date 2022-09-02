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
    ok: (roomId, isHost) => ({ type: 'room/create', roomId, isHost }),
  },
  join: {
    added: (roomId, name) => ({
      type: 'room/join', roomId, name, status: JOIN_STATUS.ADDED,
    }),
  },
  error: {
    alreadyAdded: (roomId) => ({
      type: 'room/join', roomId, error: ERRORS.ERR_ALREADY_ADDED,
    }),
    isEmpty: (roomId) => ({ type: 'game/start', roomId, error: ERRORS.ERR_IS_EMPTY }),
    isFull: (roomId) => ({ type: 'room/join', roomId, error: ERRORS.ERR_IS_FULL }),
    notFound: (roomId, type = 'room/join') => ({ type, roomId, error: ERRORS.ERR_NOT_FOUND }),
    wrongHost: (roomId) => ({ type: 'game/start', roomId, error: ERRORS.ERR_WRONG_HOST }),
  },
};

export default roomActions;
