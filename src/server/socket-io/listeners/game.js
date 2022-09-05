import { getRedTetrisSingleton } from '../../entities';
import gameActions from '../actions/game';

export const onStart = (socket) => ({ gameId }) => {
  const game = getRedTetrisSingleton().findGame(gameId);

  game.registerUserInputListeners();
  game.start();

  socket.emit('game:start', gameActions.start(gameId));
};

export default onStart;
