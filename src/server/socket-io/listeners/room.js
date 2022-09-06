import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton, Room } from '../../entities';
import Game from '../../entities/Game';
import PieceGenerator from '../../entities/PieceGenerator';

import roomActions from '../actions/room';

export const onCreate = (socket) => ({ playerId, name, maxPlayers = 2 }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);

  const room = new Room({ name, host: player.id, maxPlayers });
  room.addPlayerId(player.id);

  redTetris.storeRoom(room);

  socket.join(room.id);
  socket.emit(EVENTS.ROOM.CREATE, room.toDto());
  socket.emit(EVENTS.RED_TETRIS.ROOMS, redTetris.findAllRooms().map((v) => v.toDto()));
};

export const onJoin = (socket) => ({ playerId, id }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);
  const room = redTetris.findRoom(id);

  if (!room) {
    socket.emit(EVENTS.ROOM.JOIN, roomActions.error.notFound(id));
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
  socket.emit(EVENTS.ROOM.JOIN, room.toDto());
};

export const onReady = (socket) => ({ playerId, id }) => {
  const redTetris = getRedTetrisSingleton();

  const room = redTetris.findRoom(id);

  if (!room) {
    socket.emit(EVENTS.ROOM.READY, roomActions.error.notFound(id, 'room/ready'));
    return;
  }

  if (room.isEmpty) {
    socket.emit(EVENTS.ROOM.READY, roomActions.error.isEmpty(id));
    return;
  }

  if (room.host !== playerId) {
    socket.emit(EVENTS.ROOM.READY, roomActions.error.wrongHost(id));
    return;
  }

  const pieceGenerator = redTetris.storePieceGenerator(room.id, new PieceGenerator());
  const players = room.playerIds.map((player) => redTetris.findPlayer(player.id));
  players.forEach((player) => {
    console.log({ room, player });
    const game = new Game({
      id: [room.id, player.id].join('#'),
      pieceGenerator,
      room,
      player,
    });

    player.socket.emit(EVENTS.ROOM.READY, room.toDto());
    redTetris.storeGame(game);
  });
};
