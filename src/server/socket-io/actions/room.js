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
  created: (name, isHost) => ({ name, isHost }),
  joined: (name, username) => ({
    name, username, status: JOIN_STATUS.ADDED,
  }),
  ready: (name, gameId) => ({ name, gameId }),
  error: {
    alreadyAdded: (name) => ({
      name, error: ERRORS.ERR_ALREADY_ADDED,
    }),
    isEmpty: (name) => ({ name, error: ERRORS.ERR_IS_EMPTY }),
    wrongHost: (name) => ({ name, error: ERRORS.ERR_WRONG_HOST }),
    isFull: (name) => ({ name, error: ERRORS.ERR_IS_FULL }),
    notFound: (name) => ({ name, error: ERRORS.ERR_NOT_FOUND }),
  },
};

export default roomActions;
