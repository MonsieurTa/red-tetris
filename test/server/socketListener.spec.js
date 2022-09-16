import Room from '../../src/server/entities/Room';
import Player from '../../src/server/entities/Player';
import Game from '../../src/server/entities/Game';
import PieceGenerator from '../../src/server/entities/PieceGenerator';

import {
  onGameOtherState,
  onGameReady,
  onGameState,
  onRegister,
  onRoomCreate,
  onRoomLeave,
  onRoomRemove,
  onRoomJoin,
  onRooms,
} from '../../src/client/lib/socketListeners';
import createRooms from '../helpers/entities';

it('should dispatch events', () => {
  const store = {
    dispatch: (args) => expect(args).not.toBeNull(),
    getState: () => ({ player: { id: 'Some Id ' } }),
  };

  const player = new Player('BruceWayne');
  const room = new Room({ name: 'NiceRoom', host: player });
  const rooms = createRooms();

  onRegister(store)(player);
  onRooms(store)(rooms);
  onRoomCreate(store)(room);
  onRoomRemove(store)({ id: 'Some Id' });
  onRoomJoin(store)(room);
  onRoomLeave(store)(room);

  const createGame = () => new Game({
    pieceGenerator: new PieceGenerator(),
    room,
    player,
  });

  let game = createGame();
  game.start();
  onGameReady(store)(game);

  game = createGame();
  game.start();
  onGameState(store)(game.toDto());

  game = createGame();
  game.start();
  onGameOtherState(store)(game.toDto());
});
