import Pos from './Pos';

export const DIRECTION = {
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

export const PIECES = {
  I: [
    ['.', '.', '.', '.'],
    ['I', 'I', 'I', 'I'],
    ['.', '.', '.', '.'],
    ['.', '.', '.', '.'],
  ],
  J: [
    ['J', '.', '.'],
    ['J', 'J', 'J'],
    ['.', '.', '.'],
  ],
  L: [
    ['.', '.', 'L'],
    ['L', 'L', 'L'],
    ['.', '.', '.'],
  ],
  O: [
    ['O', 'O'],
    ['O', 'O'],
  ],
  S: [
    ['.', 'S', 'S'],
    ['S', 'S', '.'],
    ['.', '.', '.'],
  ],
  T: [
    ['.', 'T', '.'],
    ['T', 'T', 'T'],
    ['.', '.', '.'],
  ],
  Z: [
    ['Z', 'Z', '.'],
    ['.', 'Z', 'Z'],
    ['.', '.', '.'],
  ],
};

const rotate = (matrix) => matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());

class Piece {
  constructor(shape, pos = new Pos()) {
    this._pos = pos;

    this._shape = shape;
    this._matrix = PIECES[shape];
    this._width = this._matrix[0].length;
    this._height = this._matrix.length;
  }

  copy() {
    return new Piece(this._shape, this._pos.copy());
  }

  move(direction = DIRECTION.DOWN) {
    switch (direction) {
      case DIRECTION.DOWN:
        this._pos._y += 1;
        break;
      case DIRECTION.LEFT:
        this._pos._x -= 1;
        break;
      case DIRECTION.RIGHT:
        this._pos._x += 1;
        break;
      default:
        return this;
    }
    return this;
  }

  rotate() {
    this._matrix = rotate(this._matrix);
    return this._matrix;
  }

  isEmpty(x, y) {
    return this._matrix[y][x] !== this._shape;
  }

  blocksPositions() {
    const positions = [];
    this._matrix.forEach((row, y) => {
      row.forEach((_, x) => {
        if (this.isEmpty(x, y)) return;

        positions.push([this._pos.x + x, this._pos.y + y]);
      });
    });
    return positions;
  }

  toDto() {
    return {
      matrix: this._matrix,
      ...this._pos.toDto(),
    };
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get shape() {
    return this._shape;
  }

  get matrix() {
    return this._matrix;
  }

  set x(x) {
    this._pos.x = x;
  }

  set y(y) {
    this._pos.y = y;
  }
}

export default Piece;
