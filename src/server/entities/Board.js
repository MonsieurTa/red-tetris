const HEIGHT = 20;
const WIDTH = 10;

export const initBoard = (defaultCell = '.') => [...Array(HEIGHT)].map(() => [...Array(WIDTH)].map(() => defaultCell));

class Board {
  constructor() {
    this._board = initBoard();
  }

  canPlace(piece) {
    return piece.blocksPositions().every(this._isAvailable);
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
}

export default Board;
