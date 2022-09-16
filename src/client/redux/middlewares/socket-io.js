import { io as Client } from 'socket.io-client';
import { WEBSOCKET } from '../../../shared/constants/redux';
import EVENTS from '../../../shared/constants/socket-io';
import { registerGameListeners, registerRedTetrisListeners, registerRoomListeners } from '../../lib/socketListeners';

import {
  setCurrentRoom,
  setSocket,
  setError,
  setRoomRunning,
} from '../reducers/red-tetris';

export const socketIoListenerMiddleware = (store) => (next) => (action) => {
  let { socket } = store.getState();

  switch (action.type) {
    case WEBSOCKET.CONNECT:
      if (socket) {
        socket.close();
      }
      socket = new Client(action.host, { transports: ['websocket'] });
      store.dispatch(setSocket(socket));

      socket.on(EVENTS.COMMON.ERROR, ({ error }) => {
        store.dispatch(setError(error));
      });

      registerRedTetrisListeners(socket, store);
      registerRoomListeners(socket, store);
      registerGameListeners(socket, store);
      break;
    case WEBSOCKET.DISCONNECT:
      if (socket) {
        socket.close();
      }
      store.dispatch(setSocket(null));
      break;
    default:
      next(action);
  }
};

export const socketIoEmitterMiddleware = (store) => (next) => (action) => {
  const { socket } = store.getState();

  if (!socket) {
    next(action);
    return;
  }

  switch (action.type) {
    case EVENTS.RED_TETRIS.REGISTER:
      socket.emit(EVENTS.RED_TETRIS.REGISTER, { username: action.username });
      break;
    case EVENTS.ROOM.CREATE:
      socket.emit(EVENTS.ROOM.CREATE, {
        playerId: store.getState().player.id,
        name: action.name,
      });
      break;
    case EVENTS.ROOM.JOIN:
      socket.emit(EVENTS.ROOM.JOIN, {
        playerId: store.getState().player.id,
        id: action.id,
      });
      break;
    case EVENTS.ROOM.LEAVE:
      socket.emit(EVENTS.ROOM.LEAVE, {
        playerId: store.getState().player.id,
        roomId: action.roomId,
      });
      store.dispatch(setCurrentRoom(null));
      store.dispatch(setRoomRunning(false));
      break;
    case EVENTS.ROOM.READY:
      socket.emit(EVENTS.ROOM.READY, {
        playerId: store.getState().player.id,
        id: action.id,
      });
      break;
    case EVENTS.GAME.START:
      socket.emit(EVENTS.GAME.START, {
        playerId: store.getState().player.id,
        gameId: action.gameId,
      });
      break;
    case EVENTS.GAME.ACTION:
      if (!store.getState().player) break;

      socket.emit(EVENTS.GAME.ACTION, {
        playerId: store.getState().player.id,
        action: action.action,
        status: action.status,
      });
      break;
    default:
      next(action);
  }
};
