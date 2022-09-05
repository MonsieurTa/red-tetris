import { EVENTS } from '../../../shared/constants';

import { getRedTetrisSingleton } from '../../entities';
import Player from '../../entities/Player';
import redTetrisActions from '../actions/red-tetris';

const onRegister = (socket) => ({ name }) => {
  const redTetris = getRedTetrisSingleton();

  const newPlayer = new Player(name);
  newPlayer.socket = socket;

  redTetris.register(newPlayer);
  socket.emit(EVENTS.RED_TETRIS.REGISTER, redTetrisActions.register(newPlayer.id));
};

const actions = {
  onRegister,
};

export default actions;
