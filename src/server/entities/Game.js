class Game {
  constructor({ id }) {
    this._id = id;
    this._running = false;
    this._current_sequence = 0;
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

  get id() {
    return this._id;
  }
}

export default Game;
