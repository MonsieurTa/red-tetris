import roomActions from '../actions/room';

export const onCreate = (redTetris, socket) => ({ gameId, playerName, maxPlayers = 2 }) => {
  let room = redTetris.findRoom(gameId);

  if (room) {
    socket.emit('room:create', roomActions.create.ok(room.id, false));
    return;
  }

  room = redTetris.createRoom(gameId, { host: playerName, maxPlayers });
  socket.emit('room:create', roomActions.create.ok(room.id, true));
};

export const onJoin = (redTetris, socket) => ({ gameId, playerName }) => {
  const room = redTetris.findRoom(gameId);

  if (!room) {
    socket.emit('room:join', roomActions.error.notFound(gameId));
    return;
  }

  if (room.isFull) {
    socket.emit('room:join', roomActions.error.isFull(gameId));
    return;
  }

  if (room.isPresent(playerName)) {
    socket.emit('room:join', roomActions.error.alreadyAdded(gameId, playerName));
    return;
  }

  room.addPlayer(playerName);
  socket.emit('room:join', roomActions.join.added(gameId, playerName));
};

export const onStart = (redTetris, socket) => ({ gameId, playerName }) => {
  const room = redTetris.find(gameId);

  if (!room) {
    socket.emit('room:start', roomActions.error.notFound(gameId));
    return;
  }

  if (room.isEmpty) {
    socket.emit('room:start', roomActions.error.isEmpty(gameId));
    return;
  }

  if (room.host !== playerName) {
    socket.emit('room:start', roomActions.error.wrongHost(gameId));
    return;
  }

  if (!room.running) {
    room.start();
    socket.emit('room:start', roomActions.start.started(gameId));
  } else {
    socket.emit('room:start', roomActions.start.alreadyStarted(gameId));
  }
};
