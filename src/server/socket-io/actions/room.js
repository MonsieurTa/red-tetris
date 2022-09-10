const JOIN_STATUS = {
  ADDED: 'ADDED',
};

export const ERRORS = {
  ERR_ALREADY_ADDED: 'ERR_ALREADY_ADDED',
  ERR_ALREADY_STARTED: 'ERR_ALREADY_STARTED',
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
};

export default roomActions;
