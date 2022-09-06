import { io as Client } from 'socket.io-client';
import actions from '../../../shared/actions/redux';
import EVENTS from '../../../shared/constants/socket-io';
import constants from '../../../shared/constants';

let socket = null;

export const socketIoListenerMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case constants.redux.WEBSOCKET.CONNECT:
      if (socket) {
        socket.close();
      }
      socket = new Client(action.host);

      socket.on('connect', () => store.dispatch(actions.webSocket.connected()));
      socket.on('connect_error', () => store.dispatch(actions.webSocket.connectError()));
      socket.on('disconnect', () => store.dispatch(actions.webSocket.disconnected()));

      // register all listeners here
      // ...

      return null;
    case constants.redux.WEBSOCKET.DISCONNECT:
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
    case constants.redux.RED_TETRIS.REGISTER:
      socket.emit(EVENTS.RED_TETRIS.REGISTER, { username: action.username });
      return null;
    case EVENTS.ROOM.CREATE:
      socket.emit(EVENTS.ROOM.CREATE, { args: 'some args' });
      return null;
    case EVENTS.ROOM.JOIN:
      socket.emit(EVENTS.ROOM.JOIN, { args: 'some args' });
      return null;
    case EVENTS.GAME.ACTION:
      socket.emit(EVENTS.GAME.ACTION, { args: 'some args' });
      return null;
    default:
      return next(action);
  }
};
