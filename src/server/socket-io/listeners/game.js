import Game from '../../entities/Game';
import gameActions from '../actions/game';
import roomActions from '../actions/room';

export const onStart = (redTetris, socket) => ({ roomId, host }) => {
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
    return;
  }

  if (!room.game) {
    const game = room.newGame();
    game.startGame();

    socket.to(room.id).emit('game:start', gameActions.start.started(roomId));
  } else {
    socket.emit('game:start', gameActions.start.alreadyStarted(roomId));
  }
};

export const onSequence = (redTetris, socket) => ({ roomId, index }) => {
  const sequence = redTetris.findRoom(roomId).game.getSequence(index);
  socket.emit('game:sequence', { type: 'game/sequence', sequence });
};

export default onStart;
