const roomActions = {
  start: (gameId) => ({ type: 'game/start', gameId }),
  draw: (pieces) => ({ type: 'game/draw', pieces }),
  error: {},
};

export default roomActions;
