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

class Pos {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._x = y;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
  }
}

class Piece {
  constructor(shape, pos = new Pos()) {
    this._pos = pos;

    this._shape = shape;
    this._matrix = PIECES[shape];
    this._width = this._matrix[0].length;
    this._height = this._matrix.length;
  }

  drop() {
    this._pos.y += 1;
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
        if (!this.isEmpty(x, y)) positions.push([x, y]);
      });
    });
    return positions;
  }

  toDto() {
    return {
      matrix: this._matrix,
      x: this._pos.x,
      y: this._pos.y,
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
}

export default Piece;
