import { Room } from '../../entities';
import roomActions from '../actions/room';

export const onCreate = (redTetris, socket) => ({ roomId, maxPlayers = 2 }) => {
  const player = redTetris.findPlayer(socket.id);
  let room = redTetris.findRoom(roomId);

  if (room) {
    socket.emit('room:create', roomActions.create.ok(room.id, false));
    return;
  }

  room = new Room({ id: roomId, host: player.id, maxPlayers });
  room.addPlayerId(player.id);

  redTetris.addRoom(roomId, { host: player.id, maxPlayers });

  socket.join(room.id);
  socket.emit('room:create', roomActions.create.ok(room.id, true));
};

export const onJoin = (redTetris, socket) => ({ roomId }) => {
  const player = redTetris.findPlayer(socket.id);
  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit('room:join', roomActions.error.notFound(roomId));
    return;
  }
  if (room.isFull) {
    socket.emit('room:join', roomActions.error.isFull(room.id));
    return;
  }

  if (room.isPresent(player.id)) {
    socket.emit('room:join', roomActions.error.alreadyAdded(room.id));
    return;
  }

  room.addPlayerId(player.id);

  socket.join(room.id);
  socket.emit('room:join', roomActions.join.added(room.id, player.name));
};
