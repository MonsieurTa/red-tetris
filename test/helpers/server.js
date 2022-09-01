import http from 'http';
import { io as Client } from 'socket.io-client';
import { configureStore } from '@reduxjs/toolkit';

import params from '../../params';
import createSocketIoServer from '../../src/server/socket-io';
import { getGameSingleton } from '../../src/server/entities';

export const createTestServer = () => new Promise((resolve) => {
  let { port } = params.server;
  const { host } = params.server;
  const httpServer = http.createServer();

  const resolver = (_host, _port) => {
    const serverSocket = createSocketIoServer(httpServer);
    const clientSocket = new Client(`http://${_host}:${_port}`);

    resolve({
      httpServer,
      serverSocket,
      clientSocket,
      engine: getGameSingleton(),
      stop: () => {
        httpServer.close(() => httpServer.unref());
        serverSocket.close();
        clientSocket.close();
      },
    });
  };

  httpServer
    .listen({ host, port }, () => resolver(host, port))
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        port += 1;
        setTimeout(() => httpServer.listen({ host, port }, () => resolver(host, port)), 250);
      }
    });
});

const configureTestStore = (
  reducer,
  socket,
  initialState,
  types,
) => configureStore({
  reducer,
  preloadedState: initialState,
  middleware: [
    myMiddleware(types),
    socketIoMiddleWare(socket),
    thunkMiddleware,
  ],
});

const myMiddleware = (types = {}) => {
  const fired = {};
  return ({ dispatch, getState }) => (next) => (action) => {
    const cb = types[action.type];

    if (cb && !fired[action.type]) {
      if (!isFunction(cb)) {
        throw new Error('action\'s type value must be a function');
      }

      fired[action.type] = true;
      cb({ getState, dispatch, action });
    }
    return next(action);
  };
};

const thunkMiddleware = ({ dispatch, getState }) =>
  (next) =>
    (action) => (isFunction(action) ? action(dispatch, getState) : next(action));

const isFunction = (arg) => typeof arg === 'function';

const socketIoMiddleWare = (socket) => ({ dispatch }) => {
  if (socket) { socket.on('action', dispatch); }

  return (next) => (action) => {
    if (socket && action.type?.indexOf('server/') === 0) {
      socket.emit('action', action);
    }
    return next(action);
  };
};

export default configureTestStore;
