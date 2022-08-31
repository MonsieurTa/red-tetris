import { Server } from 'socket.io';

const findOrCreateGame = () => null;

const registerSocketIoHandlers = (socket) => {
  socket.on('action', (action) => {
    if (action.type === 'server/ping') {
      socket.emit('action', { type: 'pong' });
    }
  });

  socket.on('game:join', ({ id, playerName }) => {
    const game = findOrCreateGame(id);

    try {
      game.addPlayer(playerName);
      socket.emit('game:join', { type: 'game/join', gameId: game.id });
    } catch (e) {
      socket.emit('game:join', { type: 'game/join', gameId: null });
    }
  });
};

const createSocketIoServer = (httpServer, { loginfo }) => {
  const io = new Server(httpServer);

  const stop = () => {
    io.close();
    httpServer.close(() => httpServer.unref());

    loginfo('Engine stopped.');
  };

  io.on('connection', (socket) => {
    loginfo(`Socket connected: ${socket.id}`);

    registerSocketIoHandlers(socket);
  });

  return { io, stop };
};

export default createSocketIoServer;
