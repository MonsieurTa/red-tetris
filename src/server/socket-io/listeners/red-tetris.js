import Player from '../../entities/Player';
import redTetrisActions from '../actions/red-tetris';

const onRegister = (redTetris, socket) => ({ name }) => {
  const newPlayer = new Player(name, socket.id);
  redTetris.register(newPlayer);
  socket.emit('red-tetris:register', redTetrisActions.register(newPlayer.id));
};

const actions = {
  onRegister,
};

export default actions;
