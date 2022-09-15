import { WIDTH, HEIGHT, initBoard } from '../../shared/helpers/board';

class Board {
  constructor() {
    this._width = WIDTH;
    this._height = HEIGHT;
    this._board = initBoard(this._width, this._height);
  }

  copy() {
    return this._board.map((row) => row.slice());
  }

  canPlace(x, y, matrix) {
    for (let _y = 0; _y < matrix.length; _y += 1) {
      for (let _x = 0; _x < matrix[0].length; _x += 1) {
        if (matrix[_y][_x] === '.') continue;
        if (!this._isAvailable(x + _x, y + _y)) return false;
      }
    }
    return true;
  }

  lock(piece) {
    const {
      x,
      y,
      matrix,
      shape,
    } = piece;

    matrix.forEach((row, _y) => {
      row.forEach((cell, _x) => {
        if (cell === '.') return;
        this._board[y + _y][x + _x] = shape;
      });
    });
  }

  toDto() {
    return { board: this._board };
  }

  addLines(count = 0) {
    const toAdd = initBoard(WIDTH, count, 'X');
    this._board = [...this._board.slice(count), ...toAdd];
  }

  clearLines() {
    const newBoard = this._board.filter((row) => !row.every((v) => v !== '.' && v !== 'X'));
    const lineCount = HEIGHT - newBoard.length;
    this._board = [...initBoard(WIDTH, lineCount), ...newBoard];
    return lineCount;
  }

  _isAvailable(x, y) {
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
