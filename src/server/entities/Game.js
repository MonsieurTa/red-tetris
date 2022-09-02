class Game {
  constructor({ id, pieceGenerator }) {
    this._id = id;
    this._running = false;
    this._pieceGenerator = pieceGenerator;
  }

  start() {
    if (this._running) return;

    this._running = true;
  }

  stop() {
    if (!this._running) return;

    this._running = false;
  }

  reset() {
    this.stop();
    this._current_sequence = 0;
  }

  draw(i) {
    return this._pieceGenerator.draw(i);
  }

  get id() {
    return this._id;
  }
}

export default Game;
