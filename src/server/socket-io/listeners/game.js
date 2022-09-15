import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton } from '../../entities';

export const onStart = () => ({ gameId }) => {
  const game = getRedTetrisSingleton().findGame(gameId);

  if (game.alive) return;

  const toEmit = game.toDto();
  game.emitToPlayer(EVENTS.GAME.STATE, toEmit);
};

export default onStart;
