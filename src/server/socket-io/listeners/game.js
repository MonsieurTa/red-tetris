import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton } from '../../entities';

export const onStart = (socket) => ({ gameId }) => {
  const game = getRedTetrisSingleton().findGame(gameId);

  game.registerUserInputListeners();
  game.start();

  socket.emit(EVENTS.GAME.START, game.toDto());
};

export default onStart;
