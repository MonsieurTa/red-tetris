import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton, Room } from '../../entities';
import Game from '../../entities/Game';
import PieceGenerator from '../../entities/PieceGenerator';

import roomActions from '../actions/room';

export const onCreate = (socket, io) => ({ playerId, name }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);
  redTetris
    .findAllRooms()
    .forEach((v) => {
      v.remove(player.id);
      player.socket.leave(v.id);
    });

  const room = new Room({ name, host: player.id });
  room.addPlayer(player);

  redTetris.storeRoom(room);

  socket.join(room.id);
  io.local.emit(EVENTS.ROOM.CREATE, room.toDto());
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

  redTetris.findAllRooms().forEach((v) => {
    v.remove(player.id);
    player.socket.leave(v.id);
  });

  room.addPlayer(player);

  socket.join(room.id);
  socket.emit(EVENTS.ROOM.JOIN, room.toDto());
  socket.to(room.id).emit(EVENTS.ROOM.JOIN, room.toDto());
};

export const onLeave = (socket) => ({ playerId }) => {
  const redTetris = getRedTetrisSingleton();
  const player = redTetris.findPlayer(playerId);

  redTetris.findAllRooms().forEach((room) => {
    room.remove(player.id);
    socket.leave(room.id);
    socket.to(room.id).emit(EVENTS.ROOM.LEAVE, room.toDto());

    if (room.isEmpty) {
      redTetris.deleteRoom(room.id);
    }
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

  if (redTetris.findAllGames().find((game) => game.room.id === room.id)) {
    return;
  }

  const pieceGenerator = redTetris.storePieceGenerator(room.id, new PieceGenerator());
  room.players.forEach((player) => {
    const game = new Game({ pieceGenerator, room, player });
    redTetris.storeGame(game);

    player.socket.emit(EVENTS.GAME.READY, { id: game.id });
  });
};
