const HEIGHT = 20;
const WIDTH = 10;

export const initBoard = (width = WIDTH, height = HEIGHT, defaultCell = '.') =>
  [...Array(height)].map(() => [...Array(width)].map(() => defaultCell));

class Board {
  constructor() {
    this._width = WIDTH;
    this._height = HEIGHT;
    this._board = initBoard(this._width, this._height);
  }

  copy() {
    return this._board.map((row) => row.slice());
  }

  canPlace(piece) {
    return piece.blocksPositions().every((pos) => this._isAvailable(pos));
  }

  lock(piece) {
    piece
      .blocksPositions()
      .forEach(([x, y]) => {
        this._board[y][x] = piece.shape;
      });
  }

  toDto() {
    return { board: this._board };
  }

  _isAvailable([x, y]) {
    if (x < 0 || x >= WIDTH) return false;
    if (y >= HEIGHT) return false;

    return this._board[y][x] === '.';
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

export default Board;
