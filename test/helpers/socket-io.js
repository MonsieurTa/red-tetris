import EVENTS from '../../src/shared/constants/socket-io';

export const registerPlayer = (socket, { username }) => new Promise((resolve) => {
  socket.emit(EVENTS.RED_TETRIS.REGISTER, { username });
  socket.on(EVENTS.RED_TETRIS.REGISTER, resolve);
});

export const createRoom = (socket, { playerId, name, maxPlayers }) => new Promise((resolve) => {
  socket.emit(EVENTS.ROOM.CREATE, { playerId, name, maxPlayers });
  socket.on(EVENTS.ROOM.CREATE, (args) => resolve(args.name));
});

export const joinRoom = (socket, { playerId, name }) => new Promise((resolve, reject) => {
  socket.emit(EVENTS.ROOM.JOIN, { playerId, name });
  socket.on(EVENTS.ROOM.JOIN, (args) => {
    if (args.status === 'ADDED') {
      resolve(args.name);
    } else {
      reject();
    }
  });
});

export const waitEvent = (socket, eventName) =>
  new Promise((resolve) => { socket.on(eventName, resolve); });

export const waitGameStart = (socket) =>
  new Promise((resolve) => {
    socket.on(EVENTS.ROOM.READY, (args) => { resolve(args); });
  });

export const waitBoard = (socket) =>
  new Promise((resolve) => {
    socket.on(EVENTS.GAME.BOARD, (args) => { resolve(args); });
  });
