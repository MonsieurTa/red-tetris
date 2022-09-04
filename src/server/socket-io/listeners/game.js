import Game from '../../entities/Game';
import roomActions from '../actions/room';
import PieceGenerator from '../../entities/PieceGenerator';

export const onStart = (redTetris, socket, io) => ({ playerId, roomId }) => {
  const room = redTetris.findRoom(roomId);

  if (!room) {
    socket.emit('game:start', roomActions.error.notFound(roomId, 'game/start'));
    return;
  }

  if (room.isEmpty) {
    socket.emit('game:start', roomActions.error.isEmpty(roomId));
    return;
  }

  if (room.host !== playerId) {
    socket.emit('game:start', roomActions.error.wrongHost(roomId));
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
      io,
    });

    game.start();
    redTetris.engine.add(game);
  });
};

export default onStart;
