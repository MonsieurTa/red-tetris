import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton, Room } from '../../entities';
import Game from '../../entities/Game';
import PieceGenerator from '../../entities/PieceGenerator';

import { ERRORS } from '../actions/room';

export const onCreate = (socket, io) => ({ playerId, name }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);

  const existingRoom = redTetris.findRoom(name);

  if (existingRoom) {
    if (redTetris.hasAlreadyStarted(existingRoom.id)) {
      socket.emit(EVENTS.COMMON.ERROR, { error: ERRORS.ERR_ALREADY_STARTED });
      return;
    }

    try {
      existingRoom.addPlayer(player);

      socket.join(existingRoom.id);
      socket.emit(EVENTS.ROOM.JOIN, existingRoom.toDto());
      socket.to(existingRoom.id).emit(EVENTS.ROOM.JOIN, existingRoom.toDto());
    } catch (e) {
      socket.emit(EVENTS.COMMON.ERROR, { error: e.message });
    }
  } else {
    const room = new Room({ name, host: player.id });
    room.addPlayer(player);

    redTetris.storeRoom(room);

    socket.join(room.id);
    io.local.emit(EVENTS.ROOM.CREATE, room.toDto());
  }
};

export const onJoin = (socket) => ({ playerId, id }) => {
  const redTetris = getRedTetrisSingleton();

  const player = redTetris.findPlayer(playerId);
  const room = redTetris.findRoom(id);

  if (!room) {
    socket.emit(EVENTS.COMMON.ERROR, { error: ERRORS.ERR_NOT_FOUND });
    return;
  }

  if (redTetris.hasAlreadyStarted(room.id)) {
    socket.emit(EVENTS.COMMON.ERROR, { error: ERRORS.ERR_ALREADY_STARTED });
    return;
  }

  try {
    room.addPlayer(player);

    socket.join(room.id);
    socket.emit(EVENTS.ROOM.JOIN, room.toDto());
    socket.to(room.id).emit(EVENTS.ROOM.JOIN, room.toDto());
  } catch (e) {
    socket.emit(EVENTS.COMMON.ERROR, { error: e.message });
  }
};

export const onLeave = (socket) => ({ playerId, roomId }) => {
  const redTetris = getRedTetrisSingleton();

  const room = redTetris.leaveRoom(roomId, playerId);

  if (room) {
    socket.to(roomId).emit(EVENTS.ROOM.LEAVE, room.toDto());
  }
};

export const onReady = (socket) => ({ playerId, id }) => {
  const redTetris = getRedTetrisSingleton();

  const room = redTetris.findRoom(id);

  if (!room) {
    socket.emit(EVENTS.COMMON.ERROR, { error: ERRORS.ERR_NOT_FOUND });
    return;
  }

  if (room.isEmpty) {
    socket.emit(EVENTS.COMMON.ERROR, { error: ERRORS.ERR_IS_EMPTY });
    return;
  }

  if (room.host.id !== playerId) {
    socket.emit(EVENTS.COMMON.ERROR, { error: ERRORS.ERR_WRONG_HOST });
    return;
  }

  if (redTetris.hasAlreadyStarted(room.id)) {
    socket.emit(EVENTS.COMMON.ERROR, { error: ERRORS.ERR_ALREADY_STARTED });
    return;
  }

  const pieceGenerator = redTetris.storePieceGenerator(room.id, new PieceGenerator());
  room.players.forEach((player) => {
    const game = new Game({ pieceGenerator, room, player });
    redTetris.storeGame(game);

    player.socket.emit(EVENTS.GAME.READY, { id: game.id });
  });
};
