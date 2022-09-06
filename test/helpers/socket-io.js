import { EVENTS } from '../../src/shared/constants/socket-io';
export const registerPlayer = (socket, { username }) => new Promise((resolve) => {
  socket.emit(EVENTS.RED_TETRIS.REGISTER, { username });
  socket.on(EVENTS.RED_TETRIS.REGISTER, ({ playerId }) => resolve(playerId));
});

export const createRoom = (socket, { playerId, roomId, maxPlayers }) => new Promise((resolve) => {
  socket.emit(EVENTS.ROOM.CREATE, { playerId, roomId, maxPlayers });
  socket.on(EVENTS.ROOM.CREATE, (args) => resolve(args.roomId));
});

export const joinRoom = (socket, { playerId, roomId }) => new Promise((resolve, reject) => {
  socket.emit(EVENTS.ROOM.JOIN, { playerId, roomId });
  socket.on(EVENTS.ROOM.JOIN, (args) => {
    if (args.status === 'ADDED') {
      resolve(args.roomId);
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
