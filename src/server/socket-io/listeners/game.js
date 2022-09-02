import Game from '../../entities/Game';
import roomActions from '../actions/room';
import gameActions from '../actions/game';

export const onStart = (redTetris, socket, io) => ({ roomId, host }) => {
  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit('game:start', roomActions.error.notFound(roomId));
    return;
  }

  if (room.isEmpty) {
    socket.emit('game:start', roomActions.error.isEmpty(roomId));
    return;
  }

  if (room.host !== host) {
    socket.emit('game:start', roomActions.error.wrongHost(roomId));
  }

  const pieceGenerator = redTetris.createPieceGenerator(room.id);

  room.players.forEach((player) => {
    const game = new Game({ pieceGenerator });

    redTetris.addGame(player.socketId, game);
    io.to(player.socketId).emit('game:start', gameActions.start(game.id));
  });
};

export const onSequence = (redTetris, socket) => ({ roomId, index }) => {
  const { piecesBag } = redTetris.findRoom(roomId);
  const sequence = piecesBag.deal(index);
  socket.emit('game:sequence', { type: 'game/sequence', sequence });
};

export default onStart;
