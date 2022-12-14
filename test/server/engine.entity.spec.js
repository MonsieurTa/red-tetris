import Engine from '../../src/server/entities/Engine';
import Game from '../../src/server/entities/Game';
import Room from '../../src/server/entities/Room';
import Player from '../../src/server/entities/Player';
import PieceGenerator from '../../src/server/entities/PieceGenerator';

it('should return an engine', () => {
  const engine = new Engine();
  expect(engine).not.toBeNull();
});

it('should start and stop loop', () => {
  const engine = new Engine();

  engine.run();
  expect(engine._running).toBeTruthy();

  engine.stop();
  expect(engine._running).toBeFalsy();
});

it('should add a game', () => {
  const engine = new Engine();

  const player = new Player('BruceWayne');
  const room = new Room({ name: 'Cool Room' });
  const pieceGenerator = new PieceGenerator();
  const game = new Game({ player, room, pieceGenerator });

  engine.addGames(room.id, [game]);
  expect(engine._gamesByRoomId.get(room.id)).toEqual([game]);
});

it('should return true if game is in the loop', () => {
  const engine = new Engine();

  const player = new Player('BruceWayne');
  const room = new Room({ name: 'Cool Room' });
  const pieceGenerator = new PieceGenerator();
  const game = new Game({ player, room, pieceGenerator });

  engine.addGames(room.id, [game]);
  expect(engine.hasAlreadyStarted(room.id)).toBeTruthy();
});
