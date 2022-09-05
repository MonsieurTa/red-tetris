const roomActions = {
  start: (gameId) => ({ type: 'game/start', gameId }),
  board: ({ board }) => ({ type: 'game/board', board }),
  currentPiece: (piece) => ({ type: 'game/currentPiece', ...piece }),
  error: {},
};

export default roomActions;
