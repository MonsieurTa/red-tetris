import { Server } from 'socket.io';
import eiosw from 'eiows';

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
  const io = new Server(httpServer, {
    wsEngine: eiosw.Server,
    perMessageDeflate: {
      threshold: 32768,
    },
    handlePreflightRequest: (req, res) => {
      const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': req.headers.origin, // or the specific origin you want to give access to,
        'Access-Control-Allow-Credentials': true,
      };
      res.writeHead(200, headers);
      res.end();
    },
  });

  const redTetris = getRedTetrisSingleton();

  redTetris.io = io;

  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${socket.id}`);

    socket.use(([eventName, args], next) => {
      if (!['error', 'disconnect', EVENTS.RED_TETRIS.REGISTER].includes(eventName)) {
        const player = redTetris.findPlayer(args.playerId);
        if (!player) {
          return next(new NotRegistered(eventName, args));
        }
        player.socket = socket;
      }

      return next();
    });

    socket.on('error', (error) => {
      socket.emit(error.type, { error: error.message });
    });

    socket.on('disconnect', () => {
      loginfo(`Socket disconnected: ${socket.id}`);
      redTetris.unregister(socket.id);
    });

    socket.on(EVENTS.RED_TETRIS.REGISTER, redTetrisListeners.onRegister(socket));
    socket.on(EVENTS.ROOM.CREATE, roomListeners.onCreate(socket, io));
    socket.on(EVENTS.ROOM.JOIN, roomListeners.onJoin(socket, io));
    socket.on(EVENTS.ROOM.LEAVE, roomListeners.onLeave(socket));
    socket.on(EVENTS.ROOM.READY, roomListeners.onReady(socket));

    socket.on(EVENTS.GAME.START, gameListeners.onStart(socket));

    socket.emit(EVENTS.RED_TETRIS.ROOMS, redTetris.findAllRooms().map((v) => v.toDto()));
  });

  return io;
};

export default createSocketIoServer;
