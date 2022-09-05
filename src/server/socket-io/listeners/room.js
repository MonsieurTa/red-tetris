import { EVENTS } from '../../../shared/constants';

import { getRedTetrisSingleton, Room } from '../../entities';
import Game from '../../entities/Game';
import PieceGenerator from '../../entities/PieceGenerator';
import roomActions from '../actions/room';

export const onCreate = (socket) => ({ playerId, roomId, maxPlayers = 2 }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);
  let room = redTetris.findRoom(roomId);

  if (room) {
    socket.emit(EVENTS.ROOM.CREATE, roomActions.created(room.id, false));
    return;
  }

  room = new Room({ id: roomId, host: player.id, maxPlayers });
  room.addPlayerId(player.id);

  redTetris.storeRoom(room);

  socket.join(room.id);
  socket.emit(EVENTS.ROOM.CREATE, roomActions.created(room.id, true));
};

export const onJoin = (socket) => ({ playerId, roomId }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);
  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit(EVENTS.ROOM.JOIN, roomActions.error.notFound(roomId));
    return;
  }
  if (room.isFull) {
    socket.emit(EVENTS.ROOM.JOIN, roomActions.error.isFull(room.id));
    return;
  }

  if (room.isPresent(player.id)) {
    socket.emit(EVENTS.ROOM.JOIN, roomActions.error.alreadyAdded(room.id));
    return;
  }

  room.addPlayerId(player.id);

  socket.join(room.id);
  socket.emit(EVENTS.ROOM.JOIN, roomActions.joined(room.id, player.name));
};

export const onReady = (socket) => ({ playerId, roomId }) => {
  const redTetris = getRedTetrisSingleton();

  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit(EVENTS.ROOM.READY, roomActions.error.notFound(roomId, 'room/ready'));
    return;
  }

  if (room.isEmpty) {
    socket.emit(EVENTS.ROOM.READY, roomActions.error.isEmpty(roomId));
    return;
  }

  if (room.host !== playerId) {
    socket.emit(EVENTS.ROOM.READY, roomActions.error.wrongHost(roomId));
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

    player.socket.emit(EVENTS.ROOM.READY, roomActions.ready(roomId, game.id));
    redTetris.storeGame(game);
  });
};
