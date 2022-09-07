import INPUTS from '../../shared/constants/inputs';
import PIECES from '../../shared/constants/pieces';

const rotate = (matrix) => matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());

class Piece {
  constructor(shape, x = 0, y = 0, matrix = PIECES[shape]) {
    this._x = x;
    this._y = y;

    this._shape = shape;
    this._matrix = matrix;
    this._width = this._matrix[0].length;
    this._height = this._matrix.length;
  }

  copy() {
    return new Piece(
      this._shape,
      this._x,
      this._y,
      this._matrix.map((row) => row.slice()),
    );
  }

  move(direction = INPUTS.DOWN) {
    switch (direction) {
      case INPUTS.UP:
        this._y -= 1;
        break;
      case INPUTS.DOWN:
        this._y += 1;
        break;
      case INPUTS.LEFT:
        this._x -= 1;
        break;
      case INPUTS.RIGHT:
        this._x += 1;
        break;
      default:
        return this;
    }
    return this;
  }

  rotate() {
    this._matrix = rotate(this._matrix);
    return this;
  }

  isEmpty(x, y) {
    return this._matrix[y][x] !== this._shape;
  }

  blocksPositions() {
    const positions = [];
    this._matrix.forEach((row, y) => {
      row.forEach((_, x) => {
        if (this.isEmpty(x, y)) return;

        positions.push([this._x + x, this._y + y]);
      });
    });
    return positions;
  }

  toDto() {
    return {
      matrix: this._matrix,
      ...this.toDto(),
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

export default Piece;
