import Piece, { rotate } from '../../src/server/entities/Piece';
import INPUTS from '../../src/shared/constants/inputs';

it('should instantiate a piece', () => {
  expect(new Piece('I')).not.toBeNull();
});

it('should move piece', () => {
  const piece = new Piece('I', 5, 5);

  piece.move(INPUTS.UP);
  expect(piece.y).toEqual(4);

  piece.move(INPUTS.DOWN);
  expect(piece.y).toEqual(5);

  piece.move(INPUTS.LEFT);
  expect(piece.x).toEqual(4);

  piece.move(INPUTS.RIGHT);
  expect(piece.x).toEqual(5);
});

it('should detect empty cells', () => {
  const piece = new Piece('I');

  expect(piece.isEmpty(0, 0)).toBeTruthy();
  expect(piece.isEmpty(0, 1)).toBeFalsy();
});

it('should return a piece dimension', () => {
  const piece = new Piece('I');

  expect(piece.width).toEqual(4);
  expect(piece.shape).toEqual('I');
  expect(piece.matrix).toEqual([
    ['.', '.', '.', '.'],
    ['I', 'I', 'I', 'I'],
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
  ]);

  expect(piece.x).toEqual(0);

  piece.setY(1.5);
  expect(piece.y).toEqual(1);
  expect(piece.yFloat).toEqual(1.5);
});

it('should rotate I piece', () => {
  const piece = new Piece('I');
  let rotatedMatrix = rotate(piece.matrix);

  expect(rotatedMatrix).toEqual([
    ['.', '.', 'I', '.'],
    ['.', '.', 'I', '.'],
    ['.', '.', 'I', '.'],
    ['.', '.', 'I', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
    ['I', 'I', 'I', 'I'],
    ['.', '.', '.', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', 'I', '.', '.'],
    ['.', 'I', '.', '.'],
    ['.', 'I', '.', '.'],
    ['.', 'I', '.', '.'],
  ]);
});

it('should rotate J piece', () => {
  const piece = new Piece('J');
  let rotatedMatrix = rotate(piece.matrix);

  expect(rotatedMatrix).toEqual([
    ['.', 'J', 'J'],
    ['.', 'J', '.'],
    ['.', 'J', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', '.', '.'],
    ['J', 'J', 'J'],
    ['.', '.', 'J'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', 'J', '.'],
    ['.', 'J', '.'],
    ['J', 'J', '.'],
  ]);
});

it('should rotate L piece', () => {
  const piece = new Piece('L');
  let rotatedMatrix = rotate(piece.matrix);

  expect(rotatedMatrix).toEqual([
    ['.', 'L', '.'],
    ['.', 'L', '.'],
    ['.', 'L', 'L'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', '.', '.'],
    ['L', 'L', 'L'],
    ['L', '.', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['L', 'L', '.'],
    ['.', 'L', '.'],
    ['.', 'L', '.'],
  ]);
});

it('should rotate O piece', () => {
  const piece = new Piece('O');
  let rotatedMatrix = rotate(piece.matrix);

  expect(rotatedMatrix).toEqual([
    ['O', 'O'],
    ['O', 'O'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['O', 'O'],
    ['O', 'O'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['O', 'O'],
    ['O', 'O'],
  ]);
});

it('should rotate S piece', () => {
  const piece = new Piece('S');
  let rotatedMatrix = rotate(piece.matrix);

  expect(rotatedMatrix).toEqual([
    ['.', 'S', '.'],
    ['.', 'S', 'S'],
    ['.', '.', 'S'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', '.', '.'],
    ['.', 'S', 'S'],
    ['S', 'S', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['S', '.', '.'],
    ['S', 'S', '.'],
    ['.', 'S', '.'],
  ]);
});

it('should rotate T piece', () => {
  const piece = new Piece('T');
  let rotatedMatrix = rotate(piece.matrix);

  expect(rotatedMatrix).toEqual([
    ['.', 'T', '.'],
    ['.', 'T', 'T'],
    ['.', 'T', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', '.', '.'],
    ['T', 'T', 'T'],
    ['.', 'T', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', 'T', '.'],
    ['T', 'T', '.'],
    ['.', 'T', '.'],
  ]);
});

it('should rotate Z piece', () => {
  const piece = new Piece('Z');
  let rotatedMatrix = rotate(piece.matrix);

  expect(rotatedMatrix).toEqual([
    ['.', '.', 'Z'],
    ['.', 'Z', 'Z'],
    ['.', 'Z', '.'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', '.', '.'],
    ['Z', 'Z', '.'],
    ['.', 'Z', 'Z'],
  ]);

  rotatedMatrix = rotate(rotatedMatrix);
  expect(rotatedMatrix).toEqual([
    ['.', 'Z', '.'],
    ['Z', 'Z', '.'],
    ['Z', '.', '.'],
  ]);
});
