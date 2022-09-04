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
  constructor(piece, pos = new Pos()) {
    this._pos = pos;
    this._width;
    this._height;

    this._piece = PIECES[piece];
  }

  drop() {
    this._pos.y += 1;
  }

  rotate() {
    this._piece = rotate(this._piece);
    return this._piece;
  }

  toDto() {
    return {
      piece: this._piece,
      x: this._pos.x,
      y: this._pos.y,
    };
  }
}

export default Piece;
