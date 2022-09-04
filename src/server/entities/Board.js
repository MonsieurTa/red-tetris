const HEIGHT = 20;
const WIDTH = 10;

export const DIRECTION = {
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

class Board {
  constructor() {
    this._board = [...Array(HEIGHT)].map(() => [...Array(WIDTH)].map(() => '.'));
  }

  canMove(piece, direction = DIRECTION.DOWN) {
    const toCheck = [];

    piece.matrix.forEach((row, y) => {
      row.forEach((_, x) => {
        if (piece.isEmpty(x, y)) return;

        if (direction === DIRECTION.DOWN
            && (y === piece.heigth - 1 || piece.isEmpty(x, y + 1))) {
          toCheck.push([x, y + 1]);
        } else if (direction === DIRECTION.LEFT
            && (x === 0 || piece.isEmpty(x - 1, y))) {
          toCheck.push([x - 1, y]);
        } else if (direction === DIRECTION.RIGHT
            && (x === piece.width - 1 || piece.isEmpty(x + 1, y))) {
          toCheck.push([x + 1, y]);
        }
      });
    });

    return toCheck.every(this._isAvailable);
  }

  lock(piece) {
    piece
      .blocksPositions()
      .forEach(([x, y]) => {
        this._board[y][x] = piece.shape;
      });
  }

  _isAvailable([x, y]) {
    if (x < 0 || x >= WIDTH) return false;
    if (y >= HEIGHT) return false;
    return this._board[y][x] === '.';
  }

  toDto() {
    return { board: this._board };
  }
}

export default Board;
