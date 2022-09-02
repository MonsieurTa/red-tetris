import Game from '../../entities/Game';
import roomActions from '../actions/room';
import gameActions from '../actions/game';
import PieceGenerator from '../../entities/PieceGenerator';

export const onStart = (redTetris, socket, io) => ({ roomId }) => {
  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit('game:start', roomActions.error.notFound(roomId, 'game/start'));
    return;
  }

  if (room.isEmpty) {
    socket.emit('game:start', roomActions.error.isEmpty(roomId));
    return;
  }

  if (room.host !== socket.id) {
    socket.emit('game:start', roomActions.error.wrongHost(roomId));
    return;
  }

  const pieceGenerator = redTetris.storePieceGenerator(room.id, new PieceGenerator());
  const players = room.playerIds.map((id) => redTetris.findPlayer(id));

  players.forEach((player) => {
    const game = new Game({ id: `${room.id}#${player.id}`, pieceGenerator });
    redTetris.storeGame(game);

    io.to(player.id).emit('game:start', gameActions.start(game.id));
  });
};

export const onDraw = (redTetris, socket) => ({ gameId, i = 0 }) => {
  const game = redTetris.findGame(gameId);
  const pieces = game.draw(i);

  socket.emit('game:draw', gameActions.draw(pieces));
};

export default onStart;
