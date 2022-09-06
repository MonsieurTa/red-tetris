import EVENTS from '../../../shared/constants/socket-io';

import { getRedTetrisSingleton } from '../../entities';
import REDUX_ACTIONS from '../../../shared/actions/redux';

export const onStart = (socket) => ({ gameId }) => {
  const game = getRedTetrisSingleton().findGame(gameId);

  game.registerUserInputListeners();
  game.start();

  socket.emit(EVENTS.GAME.START, REDUX_ACTIONS.GAME.start(gameId));
};

export default onStart;
