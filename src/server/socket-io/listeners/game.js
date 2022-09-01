import gameActions from '../actions/game';

export const onCreate = (redTetris, socket) => ({ gameId, playerName, maxPlayers = 2 }) => {
  let game = redTetris.findGame(gameId);

  if (game) {
    socket.emit('game:create', gameActions.create.ok(game.id, false));
    return;
  }

  game = redTetris.createGame(gameId, { host: playerName, maxPlayers });
  socket.emit('game:create', gameActions.create.ok(game.id, true));
};

export const onJoin = (redTetris, socket) => ({ gameId, playerName }) => {
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
};

export const onStart = (redTetris, socket) => ({ gameId, playerName }) => {
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
};
