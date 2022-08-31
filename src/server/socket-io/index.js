import { Server } from 'socket.io';
import { getRedTetrisSingleton } from '../entities';

const registerSocketIoHandlers = (socket) => {
  const redTetris = getRedTetrisSingleton();

  socket.on('action', (action) => {
    if (action.type === 'server/ping') {
      socket.emit('action', { type: 'pong' });
    }
  });

  socket.on('game:join', ({ id, playerName }) => {
    const game = redTetris.findOrCreateGame(id);

    try {
      game.addPlayer(playerName);
      socket.emit('game:join', { type: 'game/join', gameId: game.id, playerName });
    } catch (e) {
      socket.emit('game:join', { type: 'game/join', gameId: null, error: e.msg });
    }
  });
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
