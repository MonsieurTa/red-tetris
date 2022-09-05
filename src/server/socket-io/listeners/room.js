import { getRedTetrisSingleton, Room } from '../../entities';
import Game from '../../entities/Game';
import PieceGenerator from '../../entities/PieceGenerator';
import roomActions from '../actions/room';

export const onCreate = (socket) => ({ playerId, roomId, maxPlayers = 2 }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);
  let room = redTetris.findRoom(roomId);

  if (room) {
    socket.emit('room:create', roomActions.create.ok(room.id, false));
    return;
  }

  room = new Room({ id: roomId, host: player.id, maxPlayers });
  room.addPlayerId(player.id);

  redTetris.storeRoom(room);

  socket.join(room.id);
  socket.emit('room:create', roomActions.create.ok(room.id, true));
};

export const onJoin = (socket) => ({ playerId, roomId }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);
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

export const onReady = (socket) => ({ playerId, roomId }) => {
  const redTetris = getRedTetrisSingleton();

  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit('room:ready', roomActions.error.notFound(roomId, 'room/ready'));
    return;
  }

  if (room.isEmpty) {
    socket.emit('room:ready', roomActions.error.isEmpty(roomId));
    return;
  }

  if (room.host !== playerId) {
    socket.emit('room:ready', roomActions.error.wrongHost(roomId));
    return;
  }

  const pieceGenerator = redTetris.storePieceGenerator(room.id, new PieceGenerator());
  const players = room.playerIds.map((id) => redTetris.findPlayer(id));

  players.forEach((player) => {
    const game = new Game({
      id: [room.id, player.id].join('#'),
      pieceGenerator,
      room,
      player,
    });

    game.start();
    redTetris.engine.add(game);
  });
};
