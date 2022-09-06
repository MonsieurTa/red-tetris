import EVENTS from '../../src/shared/constants/socket-io';

export const registerPlayer = (socket, { username }) => new Promise((resolve) => {
  socket.emit(EVENTS.RED_TETRIS.REGISTER, { username });
  socket.on(EVENTS.RED_TETRIS.REGISTER, resolve);
});

export const createRoom = (socket, { playerId, name, capacity }) => new Promise((resolve) => {
  socket.emit(EVENTS.ROOM.CREATE, { playerId, name, capacity });
  socket.on(EVENTS.ROOM.CREATE, resolve);
});

export const joinRoom = (socket, { playerId, id }) => new Promise((resolve) => {
  socket.emit(EVENTS.ROOM.JOIN, { playerId, id });
  socket.on(EVENTS.ROOM.JOIN, resolve);
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
