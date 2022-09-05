import { Server } from 'socket.io';

import { getRedTetrisSingleton } from '../entities';
import * as roomListeners from './listeners/room';
import * as gameListeners from './listeners/game';
import redTetrisListeners from './listeners/red-tetris';

class NotRegistered extends Error {
  constructor(type, args) {
    super('NotRegistered');
    this.type = type;
    this.args = args;
  }
}

const createSocketIoServer = (httpServer, { loginfo = () => {} } = {}) => {
  const io = new Server(httpServer);
  const redTetris = getRedTetrisSingleton();

  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${socket.id}`);

    socket.on('ping', (action) => {
      if (action.type === 'server/ping') {
        socket.emit('ping', { type: 'pong' });
      }
    });

    socket.on('red-tetris:register', redTetrisListeners.onRegister(socket));

    socket.on('error', (error) => {
      socket.emit(error.type, { error: error.message });
    });

    socket.use(([eventName, args], next) => {
      if (!['ping', 'red-tetris:register'].includes(eventName)) {
        const player = redTetris.findPlayer(args.playerId);
        if (!player) {
          return next(new NotRegistered(eventName, args));
        }
        player.socket = socket;
      }

      return next();
    });

    socket.on('room:create', roomListeners.onCreate(socket));
    socket.on('room:join', roomListeners.onJoin(socket));
    socket.on('room:ready', roomListeners.onReady(socket));
  });

  return io;
};

export default createSocketIoServer;
