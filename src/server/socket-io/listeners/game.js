import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton } from '../../entities';

export const onStart = () => ({ gameId }) => {
  const redTetris = getRedTetrisSingleton();

  const game = getRedTetrisSingleton().findGame(gameId);

  if (game.alive) return;

  redTetris.startGame(game);

  const toEmit = game.toDto();
  game.emitToPlayer(EVENTS.GAME.STATE, toEmit);
};

export default onStart;
