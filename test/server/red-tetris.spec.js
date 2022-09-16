import Player from '../../src/server/entities/Player';
import RedTetris from '../../src/server/entities/RedTetris';

it('should unregister a player', () => {
  const player = new Player('BruceWayne');
  player.socket = { id: 'some id' };

  const redTetris = new RedTetris();

  const io = {
    local: {
      emit: (eventName, args) => {
        expect(eventName).not.toBeNull();
        expect(args).not.toBeNull();
      },
    },
  };

  redTetris.io = io;

  redTetris.register(player);
  expect(redTetris._players.size).toEqual(1);

  redTetris.unregister(player.socket.id);
  expect(redTetris._players.size).toEqual(0);
});
