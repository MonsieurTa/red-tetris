import { Server } from 'socket.io';

import EVENTS from '../../shared/constants/socket-io';
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

  const broadcastRooms = (socket) => socket.emit(
    EVENTS.RED_TETRIS.ROOMS,
    redTetris.findAllRooms().map((v) => v.toDto()),
  );

  (function cycleBroadcast() {
    setTimeout(() => {
      broadcastRooms(io.local);
      cycleBroadcast();
    }, 5000);
  }());

  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${socket.id}`);

    broadcastRooms(socket);

    socket.on('ping', (action) => {
      if (action.type === 'server/ping') {
        socket.emit('ping', { type: 'pong' });
      }
    });

    socket.on(EVENTS.RED_TETRIS.REGISTER, redTetrisListeners.onRegister(socket));

    socket.on('error', (error) => {
      socket.emit(error.type, { error: error.message });
    });

    socket.on('disconnect', () => {
      loginfo(`Socket disconnected: ${socket.id}`);
      // remove player
    });

    socket.use(([eventName, args], next) => {
      if (!['error', 'disconnect', 'ping', EVENTS.RED_TETRIS.REGISTER].includes(eventName)) {
        const player = redTetris.findPlayer(args.playerId);
        if (!player) {
          return next(new NotRegistered(eventName, args));
        }
        player.socket = socket;
      }

      return next();
    });

    socket.on(EVENTS.ROOM.CREATE, roomListeners.onCreate(socket));
    socket.on(EVENTS.ROOM.JOIN, roomListeners.onJoin(socket));
    socket.on(EVENTS.ROOM.READY, roomListeners.onReady(socket));

    socket.on(EVENTS.GAME.START, gameListeners.onStart(socket));
  });

  return io;
};

export default createSocketIoServer;
