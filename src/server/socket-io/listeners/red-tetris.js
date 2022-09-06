import EVENTS from '../../../shared/constants/socket-io';
import { getRedTetrisSingleton } from '../../entities';
import Player from '../../entities/Player';
import REDUX_ACTIONS from '../../../shared/actions/redux';

const onRegister = (socket) => ({ username }) => {
  const redTetris = getRedTetrisSingleton();

  const newPlayer = new Player(username);
  newPlayer.socket = socket;

  redTetris.register(newPlayer);
  socket.emit(EVENTS.RED_TETRIS.REGISTER, REDUX_ACTIONS.RED_TETRIS.register(newPlayer.id));
};

const actions = {
  onRegister,
};

export default actions;
