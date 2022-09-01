import { Server } from 'socket.io';
import { getRedTetrisSingleton } from '../entities';
import gameActions from './actions/game';

const registerSocketIoHandlers = (socket) => {
  const redTetris = getRedTetrisSingleton();

  socket.on('action', (action) => {
    if (action.type === 'server/ping') {
      socket.emit('action', { type: 'pong' });
    }
  });

  socket.on('game:create', ({ gameId, playerName, maxPlayers = 2 }) => {
    let game = redTetris.findGame(gameId);

    if (game) {
      socket.emit('game:create', gameActions.create.ok(game.id, false));
      return;
    }

    game = redTetris.createGame(gameId, { host: playerName, maxPlayers });
    socket.emit('game:create', gameActions.create.ok(game.id, true));
  });

  socket.on('game:join', ({ gameId, playerName }) => {
    const game = redTetris.findGame(gameId);

    if (!game) {
      socket.emit('game:join', gameActions.error.notFound(gameId));
      return;
    }

    if (game.isFull) {
      socket.emit('game:join', gameActions.error.isFull(gameId));
      return;
    }

    if (game.isPresent(playerName)) {
      socket.emit('game:join', gameActions.error.alreadyAdded(gameId, playerName));
      return;
    }

    game.addPlayer(playerName);
    socket.emit('game:join', gameActions.join.added(gameId, playerName));
  });

  socket.on('game:start', ({ gameId, playerName }) => {
    const game = redTetris.find(gameId);

    if (!game) {
      socket.emit('game:start', gameActions.error.notFound(gameId));
      return;
    }

    if (game.isEmpty) {
      socket.emit('game:start', gameActions.error.isEmpty(gameId));
      return;
    }

    if (game.host !== playerName) {
      socket.emit('game:start', gameActions.error.wrongHost(gameId));
      return;
    }

    if (!game.running) {
      game.start();
      socket.emit('game:start', gameActions.start.started(gameId));
    } else {
      socket.emit('game:start', gameActions.start.alreadyStarted(gameId));
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
