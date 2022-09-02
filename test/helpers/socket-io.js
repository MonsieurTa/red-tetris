const registerPlayer = (socket) => new Promise((resolve) => {
  socket.on('red-tetris:register', ({ playerId }) => resolve(playerId));
});

export default registerPlayer;
