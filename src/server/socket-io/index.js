import { Server } from 'socket.io';

import { getRedTetrisSingleton } from '../entities';
import * as roomListeners from './listeners/room';
import * as gameListeners from './listeners/game';
import Player from '../entities/Player';

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

    socket.on('red-tetris:register', ({ name }) => {
      const newPlayer = new Player(name);
      redTetris.register(socket.id, newPlayer);
    });

    socket.on('error', (error) => {
      socket.emit(error.type, { error: error.message });
    });

    socket.use(([eventName, args], next) => {
      if (!['ping', 'red-tetris:register'].includes(eventName)) {
        if (!redTetris.findPlayer(socket.id)) {
          return next(new NotRegistered(eventName, args));
        }
      }

      next();
    });

    socket.on('room:create', roomListeners.onCreate(redTetris, socket));
    socket.on('room:join', roomListeners.onJoin(redTetris, socket));

    socket.on('game:start', gameListeners.onStart(redTetris, socket));
  });

  return io;
};

export default createSocketIoServer;
