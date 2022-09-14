import Game from '../../src/server/entities/Game';
import Room from '../../src/server/entities/Room';
import Player from '../../src/server/entities/Player';
import PieceGenerator from '../../src/server/entities/PieceGenerator';

const createGame = () => {
  const player = new Player('Bruce Wayne');
  const room = new Room({ name: 'Cool Room' });
  const pieceGenerator = new PieceGenerator();
  return new Game({ player, room, pieceGenerator });
};

it('should return a game instance', () => {
  const game = createGame();
  expect(game).not.toBeNull();
});

it('should start/stop a game', () => {
  const game = createGame();

  game.start();
  expect(game.alive).toBeTruthy();

  game.stop();
  expect(game.alive).toBeFalsy();
});

it('should destroy a game', () => {
  const game = createGame();

  game.start();
  expect(game.alive).toBeTruthy();

  game.destroy();
  expect(game.alive).toBeFalsy();
  expect(game._room).toBeNull();
  expect(game._player).toBeNull();
  expect(game._destroyed).toBeTruthy();
});

it('should update a game', () => {
  const game = createGame();

  game.start();
  expect(game.alive).toBeTruthy();

  const oldYFloat = game._currentPiece.yFloat;
  game.update();

  expect(game._currentPiece.yFloat).toEqual(oldYFloat + game._gravity);

  const updateCount = 100;
  const expectedYFloat = (game._gravity * updateCount + game._currentPiece.yFloat)
    .toFixed(2);
  for (let i = 0; i < updateCount; i += 1) {
    game.update();
  }

  expect(game._currentPiece.yFloat.toFixed(2)).toEqual(expectedYFloat);
  expect(game._displayable).toBeTruthy();
  expect(game._firstGround).toBeTruthy();
});
