import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton } from '../../entities';

export const onStart = () => ({ gameId }) => {
  const game = getRedTetrisSingleton().findGame(gameId);

  if (game.alive) return;

  game.registerUserInputListeners();
  game.start();

  const toEmit = game.toDto();
  game.emitToPlayer(EVENTS.GAME.STATE, toEmit);
  game.emitToRoom(EVENTS.GAME.OTHERS_STATE, toEmit);
};

export default onStart;
