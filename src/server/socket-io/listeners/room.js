import roomActions from '../actions/room';

export const onCreate = (redTetris, socket) => ({ roomId, playerName, maxPlayers = 2 }) => {
  let room = redTetris.findRoom(roomId);

  if (room) {
    socket.emit('room:create', roomActions.create.ok(room.id, false));
    return;
  }

  room = redTetris.createRoom(roomId, { host: playerName, maxPlayers });

  socket.join(room.id);
  socket.emit('room:create', roomActions.create.ok(room.id, true));
};

export const onJoin = (redTetris, socket) => ({ roomId, playerName }) => {
  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit('room:join', roomActions.error.notFound(roomId));
    return;
  }

  if (room.isFull) {
    socket.emit('room:join', roomActions.error.isFull(room.id));
    return;
  }

  if (room.isPresent(playerName)) {
    socket.emit('room:join', roomActions.error.alreadyAdded(room.id, playerName));
    return;
  }

  room.addPlayer(playerName);

  socket.join(room.id);
  socket.emit('room:join', roomActions.join.added(room.id, playerName));
};
