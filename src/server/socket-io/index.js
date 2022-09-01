import { Server } from 'socket.io';

import { getRedTetrisSingleton } from '../entities';
import * as gameListeners from './listeners/game';

const registerSocketIoHandlers = (socket) => {
  const redTetris = getRedTetrisSingleton();

  socket.on('action', (action) => {
    if (action.type === 'server/ping') {
      socket.emit('action', { type: 'pong' });
    }
  });

  socket.on('game:create', gameListeners.onCreate(redTetris, socket));
  socket.on('game:join', gameListeners.onJoin(redTetris, socket));
  socket.on('game:start', gameListeners.onStart(redTetris, socket));
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
