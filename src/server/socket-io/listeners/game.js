import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton } from '../../entities';

export const onStart = () => ({ gameId }) => {
  const game = getRedTetrisSingleton().findGame(gameId);

  if (game.alive) return;

  game.registerUserInputListeners();
  game.start();

  game.emitToPlayer(EVENTS.GAME.STATE, game.toDto());
};

export default onStart;
