class Pos {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }

  copy() {
    return new Pos(this._x, this._y);
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

  toDto() {
    return {
      x: this._x,
      y: this._y,
    };
  }
}

export default Pos;
