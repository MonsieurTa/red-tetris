const GAME_STATUS = {
  STARTED: 'STARTED',
};

const roomActions = {
  start: {
    started: (roomId) => ({ type: 'game/start', roomId, status: GAME_STATUS.STARTED }),
    alreadyStarted: (roomId) => ({ type: 'game/start', roomId, status: GAME_STATUS.ALREADY_STARTED }),
  },
  error: {},
};

export default roomActions;
