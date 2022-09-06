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
  created: (name, isHost) => ({ type: 'room/create', name, isHost }),
  joined: (name, username) => ({
    type: 'room/join', name, username, status: JOIN_STATUS.ADDED,
  }),
  ready: (name, gameId) => ({ type: 'room/ready', name, gameId }),
  error: {
    alreadyAdded: (name) => ({
      type: 'room/join', name, error: ERRORS.ERR_ALREADY_ADDED,
    }),
    isEmpty: (name) => ({ type: 'room/ready', name, error: ERRORS.ERR_IS_EMPTY }),
    wrongHost: (name) => ({ type: 'room/ready', name, error: ERRORS.ERR_WRONG_HOST }),
    isFull: (name) => ({ type: 'room/join', name, error: ERRORS.ERR_IS_FULL }),
    notFound: (name, type = 'room/join') => ({ type, name, error: ERRORS.ERR_NOT_FOUND }),
  },
};

export default roomActions;
