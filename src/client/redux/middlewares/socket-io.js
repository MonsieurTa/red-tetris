import { io as Client } from 'socket.io-client';
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
    case WS_ACTIONS.JOIN_ROOM:
      socket.emit('join_room', { id: 'some id' });

      return null;
    default:
      return next(action);
  }
};
