import INPUTS from '../../shared/constants/inputs';
import PIECES from '../../shared/constants/pieces';

export const rotate = (matrix) =>
  matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());

class Piece {
  constructor(shape, x = 0, y = 0, matrix = PIECES[shape]) {
    this._x = x;
    this._y = y;

    this._shape = shape;
    this._matrix = matrix;
    this._width = this._matrix[0].length;
    this._height = this._matrix.length;
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

  isEmpty(x, y) {
    return this._matrix[y][x] !== this._shape;
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

  set matrix(v) {
    this._matrix = v;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return Math.floor(this._y);
  }

  setY(y) {
    this._y = y;
  }

  get yFloat() {
    return this._y;
  }
}

export default Piece;
