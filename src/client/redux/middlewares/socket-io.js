import { io as Client } from 'socket.io-client';
import { EVENTS } from '../../../shared/constants';
import actions, { WS_ACTIONS } from '../actions/socket-io';

let socket = null;

export const socketIoListenerMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case WS_ACTIONS.CONNECT:
      if (socket) {
        socket.close();
      }
      socket = new Client(action.host);

      socket.on('connect', () => store.dispatch(actions.connected()));
      socket.on('connect_error', () => store.dispatch(actions.connectError()));
      socket.on('disconnect', () => store.dispatch(actions.disconnected()));

      // register all listeners here
      // ...

      return null;
    case WS_ACTIONS.DISCONNECT:
      if (socket) {
        socket.close();
      }

      socket = null;
      return null;
    default:
      return next(action);
  }
};

export const socketIoEmitterMiddleware = () => (next) => (action) => {
  switch (action.type) {
    case WS_ACTIONS.RED_TETRIS.REGISTER:
      socket.emit(EVENTS.RED_TETRIS.REGISTER, { args: 'some args' });
      return null;
    case WS_ACTIONS.ROOM.CREATE:
      socket.emit(EVENTS.ROOM.CREATE, { args: 'some args' });
      return null;
    case WS_ACTIONS.ROOM.JOIN:
      socket.emit(EVENTS.ROOM.JOIN, { args: 'some args' });
      return null;
    case WS_ACTIONS.GAME.ACTION:
      socket.emit(EVENTS.GAME.ACTION, { args: 'some args' });
      return null;
    default:
      return next(action);
  }
};
