import { Server } from 'socket.io';

import { getGameSingleton } from '../entities';
import * as roomListeners from './listeners/room';

const registerSocketIoHandlers = (socket) => {
  const redTetris = getGameSingleton();

  socket.on('action', (action) => {
    if (action.type === 'server/ping') {
      socket.emit('action', { type: 'pong' });
    }
  });

  socket.on('room:create', roomListeners.onCreate(redTetris, socket));
  socket.on('room:join', roomListeners.onJoin(redTetris, socket));
  socket.on('game:start', roomListeners.onStart(redTetris, socket));
};

const createSocketIoServer = (httpServer, { loginfo = () => {} } = {}) => {
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${socket.id}`);

    registerSocketIoHandlers(socket);
  });

  return io;
};

export default createSocketIoServer;
