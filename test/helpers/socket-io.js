export const registerPlayer = (socket, { name }) => new Promise((resolve) => {
  socket.emit('red-tetris:register', { name });
  socket.on('red-tetris:register', ({ playerId }) => resolve(playerId));
});

export const createRoom = (socket, { playerId, roomId, maxPlayers }) => new Promise((resolve) => {
  socket.emit('room:create', { playerId, roomId, maxPlayers });
  socket.on('room:create', (args) => resolve(args.roomId));
});

export const joinRoom = (socket, { playerId, roomId }) => new Promise((resolve, reject) => {
  socket.emit('room:join', { playerId, roomId });
  socket.on('room:join', (args) => {
    if (args.status === 'ADDED') {
      resolve(args.roomId);
    } else {
      reject();
    }
  });
});

export const waitEvent = (socket, eventName) =>
  new Promise((resolve) => { socket.on(eventName, resolve); });

export const waitGameStart = (socket) => new Promise((resolve) => {
  socket.on('game:start', (args) => {
    resolve(args);
  });
});

export const waitBoard = (socket) => new Promise((resolve) => {
  socket.on('game:board', (args) => {
    resolve(args);
  });
});
