import EVENTS from '../../../shared/constants/socket-io';
import { getRedTetrisSingleton } from '../../entities';
import Player from '../../entities/Player';

const onRegister = (socket) => ({ username }) => {
  const redTetris = getRedTetrisSingleton();

  const newPlayer = new Player(username);
  newPlayer.socket = socket;

  redTetris.register(newPlayer);
  socket.emit(EVENTS.RED_TETRIS.REGISTER, newPlayer.toDto());
};

const actions = {
  onRegister,
};

export default actions;
