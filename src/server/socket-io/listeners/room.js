import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton, Room } from '../../entities';
import Game from '../../entities/Game';
import PieceGenerator from '../../entities/PieceGenerator';

import roomActions from '../actions/room';

export const onCreate = (socket) => ({ playerId, name, capacity = 2 }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);

  const room = new Room({ name, host: player.id, capacity });
  room.addPlayer(player);

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

  room.addPlayer(player);

  socket.join(room.id);
  socket.emit(EVENTS.ROOM.JOIN, {
    room: room.toDto(),
    players: room.players.map((v) => v.toDto()),
  });
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

  if (room.host.id !== playerId) {
    socket.emit(EVENTS.ROOM.READY, roomActions.error.wrongHost(id));
    return;
  }

  const pieceGenerator = redTetris.storePieceGenerator(room.id, new PieceGenerator());
  room.players.forEach((player) => {
    const game = new Game({ pieceGenerator, room, player });

    player.socket.emit(EVENTS.ROOM.READY, room.toDto());
    player.socket.emit(EVENTS.GAME.READY, game.toDto());
    redTetris.storeGame(game);
  });
};
