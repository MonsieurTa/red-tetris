import { getRedTetrisSingleton } from '../../entities';

const onStart = () => ({ gameId }) => {
  const game = getRedTetrisSingleton().findGame(gameId);

  game.registerUserInputListeners();
  game.start();
};

export default onStart;
