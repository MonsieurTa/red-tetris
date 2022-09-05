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
  created: (roomId, isHost) => ({ type: 'room/create', roomId, isHost }),
  joined: (roomId, name) => ({
    type: 'room/join', roomId, name, status: JOIN_STATUS.ADDED,
  }),
  ready: (roomId, gameId) => ({ type: 'room/ready', roomId, gameId }),
  error: {
    alreadyAdded: (roomId) => ({
      type: 'room/join', roomId, error: ERRORS.ERR_ALREADY_ADDED,
    }),
    isEmpty: (roomId) => ({ type: 'room/ready', roomId, error: ERRORS.ERR_IS_EMPTY }),
    wrongHost: (roomId) => ({ type: 'room/ready', roomId, error: ERRORS.ERR_WRONG_HOST }),
    isFull: (roomId) => ({ type: 'room/join', roomId, error: ERRORS.ERR_IS_FULL }),
    notFound: (roomId, type = 'room/join') => ({ type, roomId, error: ERRORS.ERR_NOT_FOUND }),
  },
};

export default roomActions;
