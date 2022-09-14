import Player from '../../src/server/entities/Player';
import RedTetris from '../../src/server/entities/RedTetris';

it('should unregister a player', () => {
  const player = new Player('Bruce Wayne');
  player.socket = { id: 'some id' };

  const redTetris = new RedTetris();
  redTetris.register(player);
  expect(redTetris._players.size).toEqual(1);

  redTetris.unregister(player.socket.id);
  expect(redTetris._players.size).toEqual(0);
});
