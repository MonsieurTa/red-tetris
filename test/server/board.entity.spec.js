import Board from '../../src/server/entities/Board';
import Piece from '../../src/server/entities/Piece';
import { HEIGHT, initBoard, WIDTH } from '../../src/shared/helpers/board';

it('should copy anthoer instance of board', () => {
  const board = new Board();
  const copy = board.copy();
  expect(board).not.toStrictEqual(copy);
});

it('should lock a piece', () => {
  const piece = new Piece('I');
  const board = new Board();

  board.lock(piece);
  expect(board._board[1]).toEqual([
    'I', 'I', 'I', 'I',
    '.', '.', '.', '.',
    '.', '.',
  ]);
});

it('should return a board dto', () => {
  const board = new Board();
  expect(board.toDto()).toEqual({ board: initBoard(WIDTH, HEIGHT) });
});

it('should return width and height', () => {
  const board = new Board();
  expect(board.width).toEqual(WIDTH);
  expect(board.height).toEqual(HEIGHT);
});

it('should clear no lines', () => {
  const board = new Board();
  expect(board.clearLines()).toEqual(0);
});
